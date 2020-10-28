package com.amazonaws.lambda.demo.db;

import java.sql.Blob;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import com.amazonaws.lambda.demo.model.Snippet;

public class SnippetDAO {
	java.sql.Connection conn;
	final static String table = "snippets";
	
	public SnippetDAO() {
		conn = DBConnection.connect();
	}
	
	public Snippet SQLToSnippet(ResultSet result) throws Exception {
		String id = result.getString("id");
		long timestamp = result.getLong("timestamp");
		String password = result.getString("password");
		String info = result.getString("info");
		int lang = result.getInt("lang");
		Blob textBlob = result.getBlob("text");
		String text = new String(textBlob.getBytes(1L, (int) textBlob.length()));
		
		return new Snippet(id, timestamp, password, info, text, lang);
	}
	
	public Blob snipTextToBlob(Snippet snip) throws Exception {
		Blob retBlob = conn.createBlob();
		retBlob.setBytes(1L, snip.getText().getBytes());
		
		return retBlob;
	}
	
	public Snippet getSnippet(String id) {
		try {
			Snippet retSnip = null;
			
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM " + table + " WHERE id=?;");
			ps.setString(1, id);
			ResultSet result = ps.executeQuery();
			
			while(result.next()) {
				retSnip = SQLToSnippet(result);
			}
			
			result.close();
			ps.close();
			
			return retSnip;
		}
		catch (Exception e) {
			System.err.println("DB Error: Can't get Snippet w/ id=" + id);
			e.printStackTrace();
			
			return null;
		}
	}
	
	public boolean updateSnippetInfo(Snippet snip) {
		try {
			PreparedStatement ps = conn.prepareStatement("UPDATE " + table + " SET info=? WHERE id=?;");
			ps.setString(1, snip.getInfo());
			ps.setString(2, snip.getID());
			
			int numUpdated = ps.executeUpdate();
			ps.close();
			
			return (numUpdated == 1);
		}
		catch (Exception e) {
			System.err.println("DB Error: Can't update Snippet w/ id=" + snip.getID() + " | INFO=" + snip.getInfo());
			e.printStackTrace();
			
			return false;
		}
	}
	
	public boolean updateSnippetText(Snippet snip) {
		try {
			PreparedStatement ps = conn.prepareStatement("UPDATE " + table + " SET info=? WHERE id=?;");
				
			ps.setBlob(1, snipTextToBlob(snip));
			ps.setString(2, snip.getID());
			
			int numUpdated = ps.executeUpdate();
			ps.close();
			
			return (numUpdated == 1);
		}
		catch (Exception e) {
			System.err.println("DB Error: Can't update Snippet w/ id=" + snip.getID() + " | TEXT=" + snip.getText());
			e.printStackTrace();
			
			return false;
		}
	}
	
	public boolean addSnippet(Snippet snip) {
		try {
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM " + table + " WHERE id=?;");
			ps.setString(1, snip.getID());
			
			ResultSet result = ps.executeQuery();
			
			if (result.next()) {
				throw new Exception("DB Error: Adding Snippet w/ id=" + snip.getID() + " when Snippet already exists");
			}
			
			ps = conn.prepareStatement("INSERT INTO " + table + " (id,timestamp,password,info,lang,text) values(?,?,?,?,?,?);");
			ps.setString(1, snip.getID());
			ps.setLong(2, snip.getTimestamp());
			ps.setString(3,  snip.getPassword());
			ps.setString(5, snip.getInfo());
			ps.setInt(5, snip.getLangAsInt());
			ps.setBlob(6, snipTextToBlob(snip));
			
			ps.execute();
			
			// not in og code -> if error might be with these closes
			result.close();
			ps.close();
			
			return true;
		}
		catch (Exception e) {
			System.err.println("DB Error: Can't add Snippet w/ id=" + snip.getID());
			e.printStackTrace();
			
			return false;
		}
	}
	
	public ArrayList<Snippet> getAllSnippets() {
		ArrayList<Snippet> retList = new ArrayList<Snippet>();
		
		try {
			PreparedStatement ps = conn.prepareStatement("SELECT * FROM " + table + ";");
			
			ResultSet result = ps.executeQuery();
			
			while(result.next()) {
				retList.add(SQLToSnippet(result));
			}
			
			result.close();
			ps.close();
			
			return retList;
		}
		catch (Exception e) {
			System.err.println("DB Error: Can't get all Snippets");
			e.printStackTrace();
			
			return null;
		}
	}
}
