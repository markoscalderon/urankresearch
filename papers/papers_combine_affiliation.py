import json
import csv


obj=open('papers.json','r') #load the paper.txt file which contains the downloaded papers info

j = json.loads(obj.read())

final_papers = {}

with open('results.csv', 'rb') as f:
    reader = csv.reader(f,delimiter=',',quotechar='"',quoting=csv.QUOTE_ALL)
    next(reader, None)  # skip the headers
    for row in reader:
    	res_paperID = row[0]
    	res_uniuri = row[1]

    	for i in range(0,len(j)):
			papers_paperID=j[i]['paper_id']

			if res_paperID == papers_paperID:
				if res_paperID not in final_papers:
					paper = {}
					paper['id'] = papers_paperID
					paper['meshterms'] = j[i]['meshterms']
					paper['affiliation'] = [res_uniuri]
					paper['title'] = j[i]['paper_name']
					paper['authors'] = j[i]['paper_authors']
					paper_abstract = j[i]['paper_abstract']
					
					paper_abstract_complete = ""
					if len(paper_abstract) == 1:
						if len(paper_abstract['AbstractText']) > 0:
							for text_obj in paper_abstract['AbstractText']:
								paper_abstract_complete += " " + text_obj + "\n"
					
					paper['abstract'] = paper_abstract_complete
					paper['day'] = j[i]['paper_day']
					paper['month'] = j[i]['paper_month']
					paper['year'] = j[i]['paper_year']

					final_papers[papers_paperID] = paper
				else:
					paper = final_papers[papers_paperID]
					paper['affiliation'].append(res_uniuri)
					final_papers[papers_paperID] = paper 

#print final_papers

with open('final_papers.json', 'wt') as out:
	out.write(json.dumps(final_papers.values()))