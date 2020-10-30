package com.amazonaws.db;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBConnection {

	public final static String jdbcTag = "jdbc:mysql://";
	public final static String multiQuery = "?allowMultiQueries=true";
	
	public final static String dbName = "cs509DB";
	public final static String dbPort = "3306";
	
	static Connection conn;
	
	static Connection connect() throws Exception {
		if (conn != null) {
			return conn;
		}
		
		String url = System.getenv("dbURL");
		String username = System.getenv("dbUsername");
		String password = System.getenv("dbPassword");
		
		if (url == null) {
			String error = "Env var dbURL does not exist";
			throw new Exception(error);
		}
		else if (username == null) {
			String error = "Env var dbUsername does not exist";
			throw new Exception(error);
		}
		else if (password == null) {
			String error = "Env var dbPassword does not exist";
			throw new Exception(error);
		}
		
		Class.forName("com.mysql.cj.jdbc.Driver");
		
		conn = DriverManager.getConnection(jdbcTag + url + ":" + dbPort + "/" + dbName + multiQuery, 
				username, password);
		
		return conn;
	}
}
