import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

import java.util.*;

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
			bw.write("\"name\"$\"uri\"\n");
			int counter=0;
			HashMap<String,String> map = new HashMap<String,String>();
			for (Element link : links) {
				StringBuilder br=new StringBuilder();
				String linkHref = link.attr("href");
				String linkText = link.text();
				if(!linkText.isEmpty()&&!linkHref.isEmpty()){
					String url = link.attr("href");
					if(!url.contains("http://"))
						url = "http://" + url;
					int endStr = url.indexOf("/",7);
					if(endStr < 0)
					{
						endStr = url.length();
					}
					System.out.println(url.substring(0,endStr));
					String domain = url.substring(0,endStr);

					String temp = domain.substring(7,domain.length());
					if(temp.contains(":"))
					{
						domain = domain.substring(0,temp.indexOf(":")+7);
					}

					String [] subdomains = domain.split("\\.");
					domain = "http://www." + subdomains[subdomains.length-2] + "." + subdomains[subdomains.length-1];
					

					if(!map.containsKey(domain)){


						br.append("\"");
						br.append(link.text());
						br.append("\"");
						br.append("$");
						br.append("\"");
						

						br.append(domain);
						br.append("\"");
						br.append("\n");
						counter++;
						bw.write(new String(br));
						System.out.println("link:"+domain+"  Link Test: "+linkText);
						map.put(domain,domain);
					}
				}
			}
			bw.close();
			System.out.println("counter: "+counter);

			
			
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
