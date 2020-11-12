package com.amazonaws;

import com.amazonaws.db.SnippetDAO;
import com.amazonaws.http.CreateRequest;
import com.amazonaws.http.CreateResponse;
import com.amazonaws.model.Snippet;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class CreateSnipHandlerNew implements RequestHandler<CreateRequest, CreateResponse>{

	LambdaLogger logger;

	@Override
	public CreateResponse handleRequest(CreateRequest input, Context context) {

		logger = context.getLogger();

		if (context != null) {
			context.getLogger();
		}

		logger.log("-> Snippet Create Snippet Request: " + input.toString());

        CreateResponse response;
        int statusCode = 200;

        String pw = input.getPass();

		try{

            SnippetDAO snipdao = new SnippetDAO();
			Snippet snip = null;

            if (pw.length() < 32) {
                snip = new Snippet(snipdao.getAllSnippets(), pw);
            } else {
                statusCode = 400;
            }

            snipdao.addSnippet(snip);

            response = new CreateResponse(snip.getID(), statusCode);

		} catch(Exception e) {
            logger.log(e.getMessage());
            return new CreateResponse("0", 404);
        }

        return response;
	}
}