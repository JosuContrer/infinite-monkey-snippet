package com.amazonaws.model;

public class Result {

	public static String ResultJSON(int statusCode, String result) {
		return "{ \n" +
				 "	\"isBase64Encoded\" : false, \n" +
				 "	\"statusCode\"		: " + statusCode + ", \n" +
				 " 	\"headers\" : { \n " +
				 " 		\"Access-Control-Allow-Origin\" : \"*\", \n" +
				 " 		\"Access-Control-Allow-Method\" : \"GET,POST,OPTIONS\" \n" +
				 " 	}, \n" +
				 " 	\"body\" : { \n" + 
				 "      \"result\" : \"" + result + "\" \n" +
				 "  } \n" +
				 "}";
	}
	
	public static String ErrorJSON(String errMsg, String stackTrace) {
		return "{ \n" +
				 "	\"Error\" : \"" + errMsg + "\", \n" +
				 "	\"StackTrace\" : \"" + stackTrace  + "\" \n" +
				 "}";
	}
}
