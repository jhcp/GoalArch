package derivation;

public class Util {
	public static String cleanupText(String textToCleanup) {
		String cleanedText = "";
		if (textToCleanup != null) {
			cleanedText = textToCleanup.trim().toLowerCase();
		}
		return cleanedText;
	}
}
