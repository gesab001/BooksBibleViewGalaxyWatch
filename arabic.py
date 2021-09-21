import json

f = open("arabic.json", "r", encoding="utf-8")
data = json.loads(f.read())
"""
i = 0
book = data[i]
name = book['name']
chapters = book['chapters']
numberOfChapters = len(chapters)
chapter = 1
print(book)
chapterText = chapters[chapter]
print(chapterText)
print(numberOfChapters)
verseNumber = 1
word = chapterText[verseNumber]
item = {"book": name, "chapter": chapter, "verse": verseNumber, "word": word}
books = {}
print(item)
"""

"""
jsonData = {}
for book in data:
  name = book['name']
  print(name)  
  jsonData[name] = []

print(jsonData)
for book in data:
  chapters = book['chapters']
  #print(len(chapters))
  bookTitle = book['name']
  #print(bookTitle)
  for x in range (0,len(chapters)):
    #print(len(chapter))
    chapterNumber = x+1
    #print("chapter " + chapterNumber )
    verses = chapters[x]
    #print("total verses " + str(len(verses)))
    for x in range (0, len(verses)):
      verseNumber = x+1
      word = verses[x]
      #print(str(verseNumber) + ". " + word)
      item = {"book": bookTitle, "chapter": chapterNumber, "verse": verseNumber, "word": word}
      #print(item)
      jsonData[bookTitle].append(item)

print(jsonData)     
with open("./arabicbible/arabicbible.json",  'w', encoding='utf8') as f:
  json.dump(jsonData, f, ensure_ascii=False)
"""      
    
for book in data:
  chapters = book['chapters']
  #print(len(chapters))
  bookTitle = book['name']
  #print(bookTitle)
  for x in range (0,len(chapters)):
    #print(len(chapter))
    chapterNumber = x+1
    #print("chapter " + chapterNumber )
    verses = chapters[x]
    #print("total verses " + str(len(verses)))
    for x in range (0, len(verses)):
      verseNumber = x+1
      word = verses[x]
      #print(str(verseNumber) + ". " + word)
      item = {"book": bookTitle, "chapter": chapterNumber, "verse": verseNumber, "word": word}
      #print(item)
      #jsonData[bookTitle].append(item)
      filename = bookTitle.replace(" ", "") + str(chapterNumber) + str(verseNumber) + ".json"
      print(filename)
      with open("./arabicbible/"+filename,  'w', encoding='utf8') as f:
        json.dump(item, f, ensure_ascii=False)