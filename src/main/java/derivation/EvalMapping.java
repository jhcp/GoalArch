package derivation;

import java.io.BufferedReader;
import java.io.CharArrayReader;
import java.io.FileReader;
import java.io.PushbackReader;
import java.util.Vector;

import lexer.Lexer;
import node.AOneormoreTerm;
import node.AOptionalTerm;
import node.ASequenceExp;
import node.Start;
import node.TId;
import parser.Parser;
import analysis.DepthFirstAdapter;


public class EvalMapping extends DepthFirstAdapter {
	public Vector<String> states;
	public Vector<String> transitions;
	
	
	public EvalMapping() {
		this.states = new Vector<String>();
		this.transitions = new Vector<String>();
	}
	
	public void addTransition(String transition) {
		//prevents duplicate transitions
		if (!this.transitions.contains(transition)) {
			this.transitions.add(transition);
		}
	}

	public void inStart(Start node) {
		System.out.println("input: " + node);
		EvalFirstStates evalFirst = new EvalFirstStates(true);
		node.apply(evalFirst);
		for (String firstState : evalFirst.firstStates) {
			this.addTransition("[start]-->" + firstState);
		}
	}
//	public void inASequenceExp(ASequenceExp e) {
//		System.out.println("sequence: "+e);
//	}
//	public void inAOptionalTerm(AOptionalTerm e) {
//		System.out.println("optional: "+e);
//	}
	
	public void outASequenceExp(ASequenceExp e) {
		//find what are the possible final states from the left-hand expression (source)
		EvalLastState evalLeft = new EvalLastState();
		e.getExp().apply(evalLeft);
		
		//find what are the possible initial states from the right-hand expression (target)
		EvalFirstStates evalRight = new EvalFirstStates();
		e.getTerm().apply(evalRight);
		
		//create the transitions between all possible sources and all possible targets
		for (String lastState : evalLeft.lastStates) {
			for (String firstState : evalRight.firstStates) {
				//this.transitions.add(lastState + "-->" + firstState);
				this.addTransition(lastState + "-->" + firstState);
			}
		}
		System.out.println("out a sequence");
	}
	
	public void outAOneormoreTerm(AOneormoreTerm e) {
		//find what are the possible final states for this expression (source of the loop)
		EvalLastState evalLast = new EvalLastState();
		e.getTerm().apply(evalLast);
		
		//find what are the possible initial states for this expression (target of the loop)
		EvalFirstStates evalFirst = new EvalFirstStates();
		e.getTerm().apply(evalFirst);
		
		//create the transitions between all possible sources and all possible targets
		for (String lastState : evalLast.lastStates) {
			for (String firstState : evalFirst.firstStates) {
				//this.transitions.add(lastState + "-->" + firstState);
				this.addTransition(lastState + "-->" + firstState);
			}
		}		
	}
	
	public void caseTId(TId n) {
		this.states.add(Util.cleanupText(n.getText()));
		//this.superstates_table.put(n.getText().toString().trim().toLowerCase(), new Superstate(n.getText().toString().toLowerCase(), Superstate.TYPE_ATOMIC));
	}
	
	public static EvalMapping deriveStatechart(String flowExpression) {
		try
		{
			//parses the input file
			char buf[] = new char[flowExpression.length()]; 
			flowExpression.getChars(0, flowExpression.length(), buf, 0); 
			CharArrayReader in = new CharArrayReader(buf); 
			
			Lexer lexer = new Lexer(new PushbackReader(in));
			Parser parser = new Parser(lexer);
			Start ast = parser.parse();

			//starts the tree evaluation
			EvalMapping c = new EvalMapping();
			ast.apply(c);
			
			System.out.println("=====================================");
			System.out.println("atomic states: "+c.states);
			System.out.println("transitions: "+c.transitions);
			
			return c;
		}
		catch (Exception e)
		{
			System.out.println(e);
		}
		return null;
	}
	public static void main(String[] args) {
		if (args.length < 1)
		{
			System.out.println("Usage: java EvalMapping <filename>");
			System.exit(1);
		}
		try
		{
			//parses the input file
			Lexer lexer = new Lexer(new PushbackReader
					(new BufferedReader(new FileReader(args[0])),
							1024));
			Parser parser = new Parser(lexer);
			Start ast = parser.parse();

			//starts the tree evaluation
			EvalMapping c = new EvalMapping();
			ast.apply(c);
			
			System.out.println("=====================================");
			System.out.println("atomic states: "+c.states);
			System.out.println("transitions: "+c.transitions);
		}
		catch (Exception e)
		{
			System.out.println(e);
		}
	}

}
