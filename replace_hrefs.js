const fs        = require('fs');
const path      = require('path');
const cheerio   = require('cheerio');

// Function to modify href attributes
function modifyHref(href) {
    return href.replace(/\.\/+([^\s"]+)/g, (match, p1) => './' + p1.replace(/\//g, '-'));
}

exports.replaceHref = (inputFile) => {
 
    fs.readFile(inputFile, 'utf8', (err, data) => {
        if (err) {
         //   console.error('Error reading the file:', err);
            return;
        }

        // Load HTML into cheerio
        const $ = cheerio.load(data);

        // Modify href attributes
        $('a[href]').each((_, element) => {
            const oldHref = $(element).attr('href');
            const newHref = modifyHref(oldHref);
            $(element).attr('href', newHref);
        });

        // Write the modified HTML back to a file
        fs.writeFile(inputFile, $.html(), 'utf8', (err) => {
            if (err) {
               // console.error('Error writing the file:', err);
                return;
            }
            // console.log('File successfully updated:', inputFile);
        });
    });
}