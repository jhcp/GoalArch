package domain;

import java.util.Vector;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Statechart {
	private String description;
	private Vector<String> atomicStates;
	private Vector<String> transitions;

	public Statechart() {
	}

	public Vector<String> getAtomicStates() {
		return atomicStates;
	}

	public void setAtomicStates(Vector<String> example) {
		this.atomicStates = example;
	}

	public Vector<String> getTransitions() {
		return transitions;
	}

	public void setTransitions(Vector<String> transitions) {
		this.transitions = transitions;
	}

	public String getDescription() {
		System.out.println("getting description");
		return this.description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}