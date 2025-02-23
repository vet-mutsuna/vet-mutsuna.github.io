const fs        = require('fs');
const path      = require('path');
const cheerio   = require('cheerio');

// Function to modify href attributes
function modifyHref(href) {
    return href.replace(/\.\/+([^\s"]+)/g, (match, p1) => './' + p1.replace(/\//g, '-'));
}

exports.replaceHref = (inputFile) => {
 
    fs.readFile(inputFile, 'utf8', (err, data) => {

        if (err) return;

        // Load HTML into cheerio
        const $ = cheerio.load(data);

        // Modify href attributes
        $('a[href]').each((_, element) => {

            const newHref = modifyHref($(element).attr('href'));
            $(element).attr('href', newHref);
        });

        // Experiment with data href attruibutes
        $('[data-href]').each((_, element) => {

            console.log("##$");
            console.log($(element).attr('data-href'));
            console.log(modifyHref($(element).attr('data-href')));
            console.log("======================");

            const newHref = modifyHref($(element).attr('data-href'));
            $(element).attr('data-href', newHref);
        });        


        // Write the modified HTML back to a file
        fs.writeFile(inputFile, $.html(), 'utf8', (err) => {
            if (err) return;
        });
    });
}