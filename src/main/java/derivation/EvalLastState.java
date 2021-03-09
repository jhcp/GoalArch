package derivation;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.PushbackReader;
import java.util.Vector;


import lexer.Lexer;
import node.AAlternativeTerm;
import node.AOptionalTerm;
import node.ASequenceExp;
import node.Start;
import node.TId;
import parser.Parser;
import analysis.DepthFirstAdapter;

public class EvalLastState extends DepthFirstAdapter {
	protected Vector<String> lastStates;
	
	public EvalLastState() {
		lastStates = new Vector<String>();
	}
	
	public void caseASequenceExp(ASequenceExp e) {
		e.getTerm().apply(this);
	}
	
	public void caseAAlternativeTerm(AAlternativeTerm e) {		
		e.getTerm().apply(this);
		e.getFactor().apply(this);
	}
	
	public void caseAOptionalTerm(AOptionalTerm e) {		
		if (e.parent() instanceof ASequenceExp) {
			ASequenceExp parent = (ASequenceExp) e.parent();
			parent.getExp().apply(this);
		}
		e.getTerm().apply(this);		
	}
	
	public void caseTId(TId e) {
		lastStates.add(Util.cleanupText(e.getText()));
	}
	
	public static void main(String[] args) {
		if (args.length < 1)
		{
			System.out.println("Usage: java EvalLastState <filename>");
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
			EvalLastState c = new EvalLastState();
			ast.apply(c);
			
			System.out.println("possible final states for the input expression: ");
			System.out.println(c.lastStates);
		}
		catch (Exception e)
		{
			System.out.println(e);
		}
	}

}
