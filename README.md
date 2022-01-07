For Developers
============
You can also see [C++](https://github.com/starlangsoftware/XmlParser-CPP) repository.

## Requirements

* [Node.js 14 or higher](#Node.js)
* [Git](#git)

### Node.js 

To check if you have a compatible version of Node.js installed, use the following command:

    node -v
    
You can find the latest version of Node.js [here](https://nodejs.org/en/download/).

### Git

Install the [latest version of Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Npm Install

	npm install nlptoolkit-xmlparser
	
## Download Code

In order to work on code, create a fork from GitHub page. 
Use Git for cloning the code to your local or below line for Ubuntu:

	git clone <your-fork-git-link>

A directory called util will be created. Or you can use below link for exploring the code:

	git clone https://github.com/starlangsoftware/xmlparser-js.git

## Open project with Webstorm IDE

Steps for opening the cloned project:

* Start IDE
* Select **File | Open** from main menu
* Choose `XmlParser-Js` file
* Select open as project option
* Couple of seconds, dependencies will be downloaded. 

Detailed Description
============

In order to load an xml document, we use the constructor

    let doc = new XmlDocument(fileName)
    
and parse with the parse method

    doc.parse()
    
Root node of the document can be obtained via the getFirstChild method:

    let rootNode = doc.getFirstChild()
  
For example, to iterate over the first level tags in the xml file one can use

    let rootNode = doc.getFirstChild()
    let childNode = rootNode.getFirstChild()
    while (childNode){
      ...
      childNode = childNode.getNextSibling()
    }

Tag name can be obtained via getName, pcData via getPcData methods.
