package com.amazonaws.lambda.demo.model;

public enum Language {
	C,
	CPLUS,
	JAVA,
	PYTHON;
	
	public int langToInt() { // does this work?
		int i = 0;
		for (Language j : Language.values()) {
			if (j == this) {
				return i;
			}
			i++;
		}
		
		return -1;
	}
	
	public static Language intToLang(int i) {
		Language[] langArr = Language.values();
		if (i == -1) {
			return null;
		}
		else {
			return langArr[i];
		}
	}
}
