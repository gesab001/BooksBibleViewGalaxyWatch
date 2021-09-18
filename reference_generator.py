import json

f = open("bibleallverses.json", "r")
json_data = json.load(f)
bible = json_data["bible"]
verses = []
for item in bible:
  #print(item)
  verse = [item["book"], item["chapter"], item["verse"]]
  verses.append(verse)
print(len(verses))
with open("references.json", "w") as outfile:
  json.dump(verses, outfile)