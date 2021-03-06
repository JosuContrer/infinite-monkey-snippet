package com.amazonaws.db;

import java.sql.Blob;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;

import com.amazonaws.model.Snippet;
import com.amazonaws.model.SnippetDescriptor;

public class SnippetDAO {
	java.sql.Connection conn;
	final static String table = "snippets";
	
	public SnippetDAO() throws Exception {
		conn = DBConnection.connect();
	}
	
	public Snippet SQLToSnippetNoPass(ResultSet result) throws Exception {
		String id = result.getString("id");
		long timestamp = result.getLong("timestamp");
		String info = result.getString("info");
		String lang = result.getString("lang");
		Blob textBlob = result.getBlob("text");
		String text = new String(textBlob.getBytes(1L, (int) textBlob.length()));
		
		String password = "this isn't a real password now is it";
		
		return new Snippet(id, timestamp, password, info, text, lang);
	}
	
	public Snippet SQLToSnippet(ResultSet result) throws Exception {
		Snippet snip = SQLToSnippetNoPass(result);
		snip.setPassword(result.getString("password"));
		
		return snip;
	}
	
	public SnippetDescriptor SQLToSnippetDescriptor(ResultSet result) throws Exception{
		String id = result.getString("id");
		long timestamp = result.getLong("timestamp");
		
		return new SnippetDescriptor(id, timestamp);
	}
	
	public Blob snipTextToBlob(Snippet snip) throws Exception {
		Blob retBlob = conn.createBlob();
		retBlob.setBytes(1L, snip.getText().getBytes());
		
		return retBlob;
	}
	
	public Snippet getSnippet(String id) throws Exception {
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
	
	public Snippet getSnippetNoPass(String id) throws Exception {
		Snippet retSnip = null;
		
		PreparedStatement ps = conn.prepareStatement("SELECT id,timestamp,info,lang,text FROM " + table + " WHERE id=?;");
		ps.setString(1, id);
		ResultSet result = ps.executeQuery();
		
		while(result.next()) {
			retSnip = SQLToSnippetNoPass(result);
		}
		
		result.close();
		ps.close();
		
		return retSnip;
	}
	
	public boolean deleteSnippet(String id, String password) throws Exception {
		
		Snippet snip = getSnippet(id);
		int numUpdated = -1;
		
		if(snip.isPassword(password)) {
			PreparedStatement ps = conn.prepareStatement("DELETE FROM " + table + " WHERE id=?;");
			ps.setString(1, id);
			
			numUpdated = ps.executeUpdate();
			ps.close();
		}else {
			return false;
		}
		
		return (numUpdated == 1);
	}
	
	public boolean deleteSnippetNoPass(String id) throws Exception {
		int numUpdated = -1;
		
		PreparedStatement ps = conn.prepareStatement("DELETE FROM " + table + " WHERE id=?;");
		ps.setString(1, id);
		
		numUpdated = ps.executeUpdate();
		ps.close();
		
		return (numUpdated == 1);
	}
	
	public ArrayList<String> getStaleSnippetIDs(long staleTime) throws Exception {
		ArrayList<String> retList = new ArrayList<String>();
		
		PreparedStatement ps = conn.prepareStatement("SELECT id FROM " + table + " WHERE timestamp < ?;");
		ps.setLong(1, staleTime);
		
		ResultSet result = ps.executeQuery();
		
		while(result.next()) {
			retList.add(result.getString("id"));
		}
		
		result.close();
		ps.close();
		
		return retList;
	}
	
	
	public boolean updateSnippetInfo(Snippet snip, String password) throws Exception {
		
		int numUpdated = 2;
		
		if (snip.isPassword(password)) {
			PreparedStatement ps = conn.prepareStatement("UPDATE " + table + " SET info=?, lang=? WHERE id=?;");
			ps.setString(1, snip.getInfo());
			ps.setString(2, snip.getLang());
			ps.setString(3, snip.getID());
			
			numUpdated = ps.executeUpdate();
			ps.close();
		} else {
			return false;
		}
		
		return (numUpdated == 1);
	}
	
	public boolean updateSnippetText(Snippet snip) throws Exception {
		PreparedStatement ps = conn.prepareStatement("UPDATE " + table + " SET text=? WHERE id=?;");
			
		ps.setBlob(1, snipTextToBlob(snip));
		ps.setString(2, snip.getID());
		
		int numUpdated = ps.executeUpdate();
		ps.close();
		
		return (numUpdated == 1);
	}

	public boolean addSnippet(Snippet snip) throws Exception {
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
		ps.setString(4, snip.getInfo());
		ps.setString(5, snip.getLang());
		ps.setBlob(6, snipTextToBlob(snip));
		
		ps.execute();
		
		// not in og code -> if error might be with these closes
		result.close();
		ps.close();
		
		return true;
	}
	
	/**
	 * Gets all Snippets in Database with all fields using the Snippet Model.
	 * @return Array List of Snippets
	 * @throws Exception
	 */
	public ArrayList<Snippet> getAllSnippets() throws Exception {
		ArrayList<Snippet> retList = new ArrayList<Snippet>();

		PreparedStatement ps = conn.prepareStatement("SELECT * FROM " + table + ";");
		
		ResultSet result = ps.executeQuery();
		
		while(result.next()) {
			retList.add(SQLToSnippet(result));
		}
		
		result.close();
		ps.close();
		
		return retList;
	}
	
	/**
	 * Gets all Snippets in Database with only the snippet ID and timestamp.
	 * Uses the SnippetDescriptor Model.
	 * @return Array List of SnippetDescriptors
	 * @throws Exception
	 */
	public ArrayList<SnippetDescriptor> getAllSnippetsDescriptors() throws Exception {
		ArrayList<SnippetDescriptor> retList = new ArrayList<SnippetDescriptor>();

		PreparedStatement ps = conn.prepareStatement("SELECT id, timestamp FROM " + table + " ORDER BY timestamp DESC;");
		
		ResultSet result = ps.executeQuery();
		
		while(result.next()) {
			retList.add(SQLToSnippetDescriptor(result));
		}
		
		result.close();
		ps.close();
		
		return retList;
	}
}
