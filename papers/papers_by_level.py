#Script for getting the papers by mesh term
import json
import csv
from Bio import Entrez

Entrez.email = "marcocal@usc.edu"

meshterms_processed = []

#iterate over papersID
papers = {}

with open('../meshterms/mesh_terms.csv', 'rb') as f:
    reader = csv.reader(f,delimiter='|',quotechar='"',quoting=csv.QUOTE_ALL)
    next(reader, None)  # skip the headers
    for row in reader:
    	# rows: "toplevelid"$"toplevel_name"$"secondlevelid"$"secondlevel_name"
    	meshtermID = row[0]
    	meshterm = row[1]

    	if meshtermID in meshterms_processed:
    		continue
    	else:
    		meshterms_processed.append(meshtermID)

    	handle = Entrez.esearch(db="pubmed",term=meshterm,sort="relevance",retmax=50)
        record = Entrez.read(handle)

        for paperID in record['IdList']:
			#check if paper exists
			if paperID not in papers:
				paper_data = {}
				paper_data['paper_id'] = paperID
				paper_data['meshterms'] = [meshtermID]
				paper_handle = Entrez.efetch(db="pubmed",id=paperID,retmode="xml")
				paper_record = Entrez.read(paper_handle)
				#check sample from out.txt
				paper_data['paper_name'] = paper_record[0]['MedlineCitation']['Article']['ArticleTitle']

				if paper_record[0]['MedlineCitation']['Article'].has_key('Abstract'):
					paper_data['paper_abstract'] = paper_record[0]['MedlineCitation']['Article']['Abstract']
				else:
					paper_data['paper_abstract'] = "NA"

				for pubdate in paper_record[0]['PubmedData']['History']:
					if pubdate.attributes['PubStatus'] == 'pubmed':
						paper_data['paper_month'] = pubdate['Month']
						paper_data['paper_day'] = pubdate['Day']
						paper_data['paper_year'] = pubdate['Year']
					else:
						paper_data['paper_month'] = "NA"
						paper_data['paper_day'] = "NA"
						paper_data['paper_year'] = "NA"

				paper_authors = []
				# pauthor is the iterate over the authorlist of the xml
				if paper_record[0]['MedlineCitation']['Article'].has_key('AuthorList'):
					affiliation_default = "NA"
					for pauthor in paper_record[0]['MedlineCitation']['Article']['AuthorList']:
						paper_author = {}
						if pauthor.has_key('LastName'):
							if pauthor.has_key('ForeName'):
								paper_author['name'] = pauthor['LastName'] + " " + pauthor['ForeName']
							elif pauthor.has_key('Initials'):
								paper_author['name'] = pauthor['LastName'] + " " + pauthor['Initials']
							else:
								paper_author['name'] = pauthor['LastName']
						if pauthor.has_key('Affiliation'):
							paper_author['affiliation'] = pauthor['Affiliation']
							affiliation_default = pauthor['Affiliation']
						else:
							paper_author['affiliation'] = affiliation_default
						paper_authors.append(paper_author)

				paper_data['paper_authors'] = paper_authors

				papers[paperID] = paper_data
			else:
				paper_data = papers[paperID]
				paper_data['meshterms'].append(meshtermID)
				papers[paperID] = paper_data


#store papers
with open('papers.json', 'wt') as out:
	out.write(json.dumps(papers.values()))


