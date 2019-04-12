const request =  require("request");
const fs      =  require("fs");
const siteMap =  JSON.parse(fs.readFileSync("./src/json/taskMap.json"));
const cheerio = require("../node_modules/cheerio");

//NOTE::::::::Relative pathing on json file


//this will return a mongo document, of all jobs;
const Scrape = async (location,qString,website) =>{ 
    let site  = siteMap[website];
    let siteData = await getSiteData(site,qString,location);
    try{
      return new Promise(async (resolve,reject) =>{
        let data = await parseJobData(site,siteData);
        if(data)
          resolve(data);
      })
    }catch(err){
      console.log(err);
    }
  }

//Get the site data and send the body to  get request
let getSiteData  = async (site,qString,location) => {
    return new Promise((resolve,reject) => {
        let where = ""+site.query.where;
        request({ method:'GET', url:site.url , qs:{"q":qString , [where] : location}} ,(err,res,body)=>{
            if(err || res.statusCode !== 200){
                reject(err);
                return;
            }
            resolve(body);
        });
    })
}

//Parses the data that Scrape hands off to it. 
let parseJobData = async (site,siteData) =>{
    var document = [];
    let $ = cheerio.load(siteData);
    let container= $(site.container);

    //Helper function. Gets full summary
    const getfullSummary = async (href) => {
        if(!href)
          return;
        try {
          let url = "https://ca.indeed.com";
          return new Promise((resolve, reject) => {
            request({method:'GET', url:url+href} , (err,res,body) => {
              if (err) { reject(err) }
              let $ = cheerio.load(body);
              summary = $(".jobsearch-JobComponent-description").html();
              resolve(summary);
            });
          })
        }
      catch(err){ console.log(err);}
      }

      for(i =0; i < container.length; i++){
        
        let entry = {};
        let element = cheerio.load($.html(container[i]));
        let id, fullSummary,jobTitle,companyName,location,summary = "";
        let href = element("a").first().attr("href");

        id          = element(site.container).attr("id");
        companyName = element(site.companyName).text().trim();
        jobTitle    = element(site.jobTitle).text().trim();
        location    = element(site.location).text().trim();
        summary     = element(site.jobSummary).text().trim();
        fullSummary = await getfullSummary(href);
        
        entry.id          = id;
        entry.jobTitle    = jobTitle;
        entry.companyName = companyName;
        entry.fullSummary = fullSummary;
        entry.summary     = summary
        entry.location    = location;

        document[i]= entry;
    }
    return document;  
}   

module.exports = Scrape;