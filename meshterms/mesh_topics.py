#Script for getting top level mesh terms
import csv
from Bio import Entrez
Entrez.email = "marcocal@usc.edu"

#Data array, this will have the toplevels and the second levels
data = []
data.append(["meshid","mesh_name","secondlevelid","secondlevel_name"])

print data

#Health occupations ID
occ_handle = Entrez.esummary(db="mesh",id="68006281")
occ_record = Entrez.read(occ_handle)

#IDs of top level mesh terms
#print occ_record[0]['DS_IdxLinks'][0]['Children']

#Get toplevel terms
for toplevelid in occ_record[0]['DS_IdxLinks'][0]['Children']:
	#Toplevel name search
	toplevel_handle = Entrez.esummary(db="mesh",id=toplevelid)
	toplevel_record = Entrez.read(toplevel_handle)
	toplevel_name = toplevel_record[0]['DS_MeshTerms'][0]
	
	#search for children IDs
	toplevel_children = []
	if len(toplevel_record[0]['DS_IdxLinks'][0]['Children'])>0:
		toplevel_children = toplevel_record[0]['DS_IdxLinks'][0]['Children']
		for secondlevelid in toplevel_children:
			secondlevel_handle = Entrez.esummary(db="mesh",id=secondlevelid)
			secondlevel_record = Entrez.read(secondlevel_handle)
			secondlevel_name = secondlevel_record[0]['DS_MeshTerms'][0]
			print toplevelid," ",toplevel_name," ",secondlevel_name
			data.append([secondlevelid,secondlevel_name,'',''])
			data.append([toplevelid,toplevel_name,secondlevelid,secondlevel_name])	
	else:
		print toplevelid," ",toplevel_name
		data.append([toplevelid,toplevel_name,'',''])

print data

ofile = open("mesh_terms.csv","wb")
writer = csv.writer(ofile,delimiter='|',quotechar='"',quoting=csv.QUOTE_ALL)

for row in data:
	writer.writerow(row)

ofile.close()