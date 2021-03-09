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

public class EvalFirstStates extends DepthFirstAdapter {
	protected Vector<String> firstStates;
	private boolean checkOptionalExpressions;
	
	public EvalFirstStates() {
		this.firstStates = new Vector<String>();
		this.checkOptionalExpressions = false;
	}
	
	public EvalFirstStates(boolean checkOptionalExpressions) {
		this.firstStates = new Vector<String>();
		this.checkOptionalExpressions = checkOptionalExpressions;
	}
	
	public void caseASequenceExp(ASequenceExp e) {
		e.getExp().apply(this);
	}
	
	public void caseAAlternativeTerm(AAlternativeTerm e) {		
		e.getTerm().apply(this);
		e.getFactor().apply(this);
	}
	
	public void caseAOptionalTerm(AOptionalTerm e) {		
		if (this.checkOptionalExpressions) {
			System.out.println(e.parent().parent());
			if (e.parent().parent() instanceof ASequenceExp) {
				ASequenceExp parent = (ASequenceExp) e.parent().parent();
				parent.getTerm().apply(this);
				System.out.println(true);
			}
			e.getTerm().apply(this);
			
		}
		else super.caseAOptionalTerm(e);
	}
	
	public void caseTId(TId e) {
		firstStates.add(Util.cleanupText(e.getText()));
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
			EvalFirstStates c = new EvalFirstStates();
			ast.apply(c);
			
			System.out.println("possible initial states for the input expression: ");
			System.out.println(c.firstStates);
		}
		catch (Exception e)
		{
			System.out.println(e);
		}
	}

}
