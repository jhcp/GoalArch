package domain;
import java.util.Vector;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Statechart {
	private String description;
	private Vector<String> example;
	private Vector<String> transitions;

	public Statechart() {
		example = new Vector<String>();
		example.add("teste 1");
		example.add("teste 2");
		transitions = new Vector<String>();
		transitions.add("tran 1");
		transitions.add("tran 2");
	}
	  public Vector<String> getExample() {
			return example;
		}
		public void setExample(Vector<String> example) {
			this.example = example;
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
	
	//public void addState(String state) {
		//this.states.add(state);
	//}
} 