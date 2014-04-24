import urllib
import os.path
import csv
from bs4 import BeautifulSoup

UNIVERSITY_FILENAME = "universities.html"

# We are going to download the page from shanghairanking the list of universities
# First download the html page
if not os.path.isfile(UNIVERSITY_FILENAME):
	f = open(UNIVERSITY_FILENAME,'w')
	page = urllib.urlopen("http://www.shanghairanking.com/Search.jsp")
	f.write(page.read())
	f.close()

#let's load the html
uni_file = open(UNIVERSITY_FILENAME,'r')
html = uni_file.read()
uni_file.close()

#the selector "select" with attributte equals to institution is the one that contains the universities names
soup = BeautifulSoup(html)
selects = soup.find_all('select', attrs={'class':'institution'})

#univ_names will contain the university object
univ_names = []
for sel in selects:
	for opt in sel.children:
		if opt.string != "\n" and opt.string != "------------":
			temp_shanghai_uri = str(opt)
			temp_shanghai_uri = temp_shanghai_uri.replace('<option value="','')
			idx = temp_shanghai_uri.index('">')
			temp_shanghai_uri = temp_shanghai_uri[:idx]

			#after cleaning let's assign to an object
			uname = {}
			uname['shanghai_uri'] = "http://www.shanghairanking.com/World-University-Rankings/" + temp_shanghai_uri + ".html"
			uname['name'] = unicode(opt.string)
			univ_names.append(uname)


#Now for each university we need to crawl and find the university uri and country
listUniversities = []
listUniversities.append(["native_name","en_name","country","address","url"])
for univ in univ_names:
	if "Pontificial Catholic University of Valpara" in univ["name"]:
		continue
	#print univ["name"]
	filename = "unis/" + univ["name"] + ".html";
	if not os.path.isfile(filename):
		f = open(filename,'w')
		page = urllib.urlopen(univ["shanghai_uri"])
		f.write(page.read())
		f.close()

	tempuni_file = open(filename,'r')
	uni_shanghai_html = tempuni_file.read()
	tempuni_file.close()

	uni_soup = BeautifulSoup(uni_shanghai_html)
	tabarea = uni_soup.find_all('div', attrs={"id":"tab1"})[0]

	cont = 0
	for td in tabarea.table.find_all('td'):
		cont+=1
		if cont == 2:
			native_name = unicode(td.string).encode('utf-8')
			native_name = native_name.replace("The University","University")
		elif cont == 4:
			en_name = unicode(td.string).encode('utf-8')
			en_name = en_name.replace("The University","University")
		elif cont == 8:
			country = unicode(td.string).encode('utf-8')
		elif cont == 12:
			address = unicode(td.string).encode('utf-8')
		elif cont == 14:
			url = unicode(td.a.string).encode('utf-8')
			if url[-1] == "/":
				url = url[:-1]
	if native_name == "None":
		native_name = en_name
	if en_name == "None":
		en_name = native_name
	listUniversities.append([native_name,en_name,country,address,url])

print len(listUniversities)

#finally write an output
ofile = open("universities.csv","wb")
writer = csv.writer(ofile,delimiter='$',quotechar='"',quoting=csv.QUOTE_ALL)

for row in listUniversities:
	writer.writerow(row)

ofile.close()
