import java.io.IOException;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import derivation.EvalMapping;
import domain.Statechart;

@WebServlet(
		name = "StatechartService",
		urlPatterns = {"/statechart"}
		)
public class StatechartService extends HttpServlet {

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response) 
			throws IOException {

		String flowExpression = request.getParameter("flowExpression").trim().replace("\"", "");
		
		EvalMapping mapping = EvalMapping.deriveStatechart(flowExpression);
	    Statechart statechart = new Statechart();
	    statechart.setExample(mapping.states);
	    statechart.setTransitions(mapping.transitionsShaped);
	    statechart.setDescription("Statechart generated with the GoalArch webservice");
	    
	    String statechartJsonString = new Gson().toJson(statechart);

		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().print(statechartJsonString);
		response.getWriter().flush();
	}
}