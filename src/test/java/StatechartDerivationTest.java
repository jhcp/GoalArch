import derivation.EvalMapping;
import domain.Statechart;

public class StatechartDerivationTest {

	public static void main(String[] args) {
		String flowExpression = "dt4 dt5 t3";
		flowExpression = flowExpression.trim();
		flowExpression = flowExpression.replace("\"", "");
		
		EvalMapping mapping = EvalMapping.deriveStatechart(flowExpression);
	    Statechart statechart = new Statechart();
	    statechart.setExample(mapping.states);
	    statechart.setTransitions(mapping.transitionsShaped);
	    
//	    System.out.println("flow: " + flowExpression);
	    System.out.println("final result: " + statechart.getTransitions());

	}

}
