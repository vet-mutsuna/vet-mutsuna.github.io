const fs                = require("fs");
const replaceHrefModule = require("./replace_hrefs");

const SOURCE_DIR        = "./src";
const BUILD_DIR         = "./build";
const INCLUDE_REGEX     = /<include\s+what="[^"]*"(?:\s+var:[a-zA-Z0-9_]+="[^"]*")*\s*><\/include>/g;

const convertToFileName = (path) => {

    const collection = path.split('/');
    collection.shift();
    collection.shift();
    return collection.join("-");
}

/**
 * @author Mihail Petrov
 * @param {*} htmlString 
 * @returns 
 */
const parseIncludeVars = (htmlString) => {

    const varRegex      = /var:([a-zA-Z0-9_]+)="([^"]*)"/g;
    let varCollection   = {};
    let match;

    while ((match = varRegex.exec(htmlString)) !== null) {
        varCollection[match[1]] = match[2];
    }

    return varCollection;
};

/**
 * 
 * @param {*} htmlString 
 */
const parseWhatLocation = (htmlString) => {

    const varRegex      = /what="([^"]*)"/g;
    let varCollection   = {};
    let match;

    while ((match = varRegex.exec(htmlString)) !== null) {
        varCollection['what'] = match[1];
    }

    return varCollection;
};

/**
 * @author Mihail Petrov
 * @param {*} basePath 
 */
const traverseDirectories = (basePath) => {

    try {
        const collection = fs.readdirSync(basePath);
    
        for(const path of collection) {
            traverseDirectories(`${basePath}/${path}`);
        }
    }
    catch(ex) {

        // get the file content
        let content = fs.readFileSync(basePath, "utf8");

        content     = content.replace(INCLUDE_REGEX, (match, includePath) => {

            const variableCollection = parseIncludeVars(match);
            const locationCollection = parseWhatLocation(match);
            const location           = locationCollection['what'];

            // get data from (WHAT)
            // **
            // **
            let templateHTML       = fs.readFileSync(`./${location.replace(/^@/, "")}`, "utf8");
            for(const variableId in variableCollection) {

                let regex       = new RegExp(`\\{\\{\\{${variableId}\\}\\}\\}`, "g");
                templateHTML    = templateHTML.replace(regex, variableCollection[variableId]);
            }

            return templateHTML;
        });

        fs.writeFileSync(`${BUILD_DIR}/${convertToFileName(basePath)}`, content, "utf8");
    }
};

/**
 * 
 * @param {*} dirRoot 
 */
const replaceHtmlFileHref = (dirRoot) => {

    const collection = fs.readdirSync(dirRoot);

    for(const path of collection) {
        replaceHrefModule.replaceHref(`${dirRoot}/${path}`);
    }
};

// Remove build directory and its content
fs.rmSync(BUILD_DIR, {recursive: true })

// Create new folder BUILD
fs.mkdirSync(BUILD_DIR);

// Create HTML file content
traverseDirectories(SOURCE_DIR);

// replace file content HREF
replaceHtmlFileHref(BUILD_DIR);


// Move all of the files from @css folders to the build directory
fs.cpSync('./@css'      , `${BUILD_DIR}`, {recursive: true});
fs.cpSync('./@scripts'  , `${BUILD_DIR}`, {recursive: true});
fs.cpSync('./@img'      , `${BUILD_DIR}/img`, {recursive: true});