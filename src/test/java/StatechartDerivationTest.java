import java.io.IOException;
import java.util.Vector;

import org.junit.Test;

import derivation.EvalMapping;
import junit.framework.TestCase;

public class StatechartDerivationTest extends TestCase {

	@Test
	public void testSequence() throws IOException {
		String flowExpression = "dt4 dt5 t3";
		EvalMapping mapping = EvalMapping.deriveStatechart(flowExpression);
		Vector<String> transitions = mapping.transitions;

		assertTrue(transitions.contains("[start]-->dt4"));
		assertTrue(transitions.contains("dt4-->dt5"));
		assertTrue(transitions.contains("dt5-->t3"));
		assertEquals(3, transitions.size());
	}

	@Test
	public void testAlternative() throws IOException {
		String flowExpression = "g1 g5|g9 g2";
		EvalMapping mapping = EvalMapping.deriveStatechart(flowExpression);
		Vector<String> transitions = mapping.transitions;

		assertTrue(transitions.contains("[start]-->g1"));
		assertTrue(transitions.contains("g1-->g5"));
		assertTrue(transitions.contains("g1-->g9"));
		assertTrue(transitions.contains("g5-->g2"));
		assertTrue(transitions.contains("g9-->g2"));
		assertEquals(5, transitions.size());
	}

	@Test
	public void testOptional() throws IOException {
		String flowExpression = "t3 t2? t1";
		EvalMapping mapping = EvalMapping.deriveStatechart(flowExpression);
		Vector<String> transitions = mapping.transitions;

		assertTrue(transitions.contains("[start]-->t3"));
		assertTrue(transitions.contains("t3-->t1"));
		assertTrue(transitions.contains("t3-->t2"));
		assertTrue(transitions.contains("t2-->t1"));
		assertEquals(4, transitions.size());
	}

	@Test
	public void testOptionalStart() throws IOException {
		String flowExpression = "t3? t1";
		EvalMapping mapping = EvalMapping.deriveStatechart(flowExpression);
		Vector<String> transitions = mapping.transitions;

		assertTrue(transitions.contains("[start]-->t3"));
		assertTrue(transitions.contains("t3-->t1"));
		assertTrue(transitions.contains("[start]-->t1"));
		assertEquals(3, transitions.size());
	}

	@Test
	public void testOneOrMore() throws IOException {
		String flowExpression = "t1 t2+ t3";
		EvalMapping mapping = EvalMapping.deriveStatechart(flowExpression);
		Vector<String> transitions = mapping.transitions;

		assertTrue(transitions.contains("[start]-->t1"));
		assertTrue(transitions.contains("t1-->t2"));
		assertTrue(transitions.contains("t2-->t3"));
		assertTrue(transitions.contains("t2-->t2"));
		assertEquals(4, transitions.size());
	}

	@Test
	public void testZeroOrMore() throws IOException {
		String flowExpression = "t1 t2+? t3";
		EvalMapping mapping = EvalMapping.deriveStatechart(flowExpression);
		Vector<String> transitions = mapping.transitions;

		assertTrue(transitions.contains("[start]-->t1"));
		assertTrue(transitions.contains("t1-->t2"));
		assertTrue(transitions.contains("t1-->t3"));
		assertTrue(transitions.contains("t2-->t3"));
		assertTrue(transitions.contains("t2-->t2"));
		assertEquals(5, transitions.size());
	}

}
