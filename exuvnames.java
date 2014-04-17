import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import org.jsoup.Jsoup;
import org.jsoup.helper.Validate;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;



public class exuvnames {
	
	public static void main(String arg[])
	{
		File input = new File("universities_html.html");
		try {
			BufferedWriter bw=new BufferedWriter(new FileWriter("univ_names_US.csv"));
			Document doc = Jsoup.parse(input, "UTF-8", "http://example.com/");
			Elements links = doc.getElementsByTag("a");
			int counter=0;
			for (Element link : links) {
				StringBuilder br=new StringBuilder();
				  String linkHref = link.attr("href");
				  String linkText = link.text();
				  br.append(link.text());
				  br.append(",");
				  br.append(link.attr("href"));
				  br.append("\n");
				  counter++;
				  bw.write(new String(br));
				  System.out.println("link:"+linkHref+"  Link Test: "+linkText);
				}
			bw.close();
			System.out.println("counter: "+counter);

			
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
