var shell = require('shelljs');

module.exports = function (grunt) {

  grunt.task.registerTask( 'genLongMethods', 'Generate Long Methods code smell set', function() {
    var dataset = Slides.generateSlideDataFromImages('Long Methods');
    var setWithTiming = Slides.addTimingToSlideData(dataset);
    Slides.generateSlides("templates/template.html", "longmethods.html", setWithTiming);
  });

  grunt.task.registerTask( 'downloadSparrows', 'Download images for Sparrows set', function() {
    var dataset = Slides.generateSlideDataFromUrls("Sparrows", 'sparrows.json');
  });

  grunt.task.registerTask( 'genSparrows', 'Generate Sparrows set', function() {
    var dataset = Slides.generateSlideDataFromImages('Sparrows');
    var setWithTiming = Slides.addTimingToSlideData(dataset);
    Slides.generateSlides("templates/template.html", "allsparrows.html", setWithTiming);
  });

  var Slides = (function() {

    var generateSlideDataFromImages = function(project) {
      var slideset = new Array();

      grunt.file.recurse("datasets/" + project, function callback(abspath, rootdir, subdir, filename) {
        var entry = { project: rootdir,
                      type: subdir,
                      file: filename };
        slideset.push(entry);
      });

      shuffled = shuffle(slideset);
      shuffled.forEach(function(entry) {
        grunt.log.write("entry found: " + entry.type + "/" + entry.file + "\n");
      });
      return shuffled;
    }

    var generateSlideDataFromUrls = function(project, urlsFileName) {
      var dataset = new Array();
      var types = {};

      file = grunt.file.readJSON("datasets/" + urlsFileName);

      for (var i = 0; i < file.data.length; i++) {

        if (types.hasOwnProperty(file.data[i].type)) {
          types[file.data[i].type]++;
        } else {
          types[file.data[i].type] = 1;
        };

        dataset.push({ project: "datasets/" + project,
                       type: file.data[i].type,
                       url: file.data[i].url,
                       index: i,
                       file: "image-" + i + ".jpg"
                    });
      }

      for (var setname in types) {
        if (types.hasOwnProperty(setname)) {
          grunt.log.writeln(setname);
        }
      }

      createDirectories(project, types);
      downloadImages(dataset);
    }

    var downloadImages = function(dataset) {
      dataset.forEach(function(entry) {
        var output = shell.exec('wget -N ' + '"' + entry.url + '"' + ' -O "' + entry.project + '/' + entry.type + '/' + entry.file + '"',
          { silent: false }
        ).output;
      });
    }

    var createDirectories = function(project, directories) {
      for (var setname in directories) {
        if (directories.hasOwnProperty(setname)) {
          grunt.file.mkdir("datasets/" + project + "/" + setname);
        }
      }
    }

    var addTimingToSlideData = function(slideset) {
      var setWithTimingAdded = new Array();
      var index = 0;
      slideset.forEach(function(entry) {
        setWithTimingAdded.push({ project: entry.project,
                                   type: entry.type,
                                   file: entry.file,
                                   imageTime: getTimingForImageSlide(index),
                                   answerTime: getTimingForAnswerSlide(index)
                                });
        index++;
      });
      return setWithTimingAdded;
    }

    var generateSlides = function(templateFilename, targetFilename, dataset) {
      var template = grunt.file.read(templateFilename);
      var processed = grunt.template.process(template, {data: { list: dataset }});
      grunt.file.write(targetFilename, processed);
    }

    /**
     * Return the timing for a page, progressively lower the later in the
     * slideset we are.
     */
    var getTimingForImageSlide = function(index) {
      if (index < 5) {
        return 4000;
      } else if (index < 12) {
        return 3000;
      } else if (index < 20) {
        return 2000;
      } else if (index < 30) {
        return 1500;
      } else {
        return 1000;
      }
    }

    var getTimingForAnswerSlide = function(index) {
      if (index < 5) {
        return 1500;
      } else if (index < 12) {
        return 1000;
      } else if (index < 20) {
        return 750;
      } else if (index < 30) {
        return 500;
      } else {
        return 500;
      }
    }

    var shuffle = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    return {
      generateSlideDataFromImages: generateSlideDataFromImages,
      generateSlides: generateSlides,
      addTimingToSlideData: addTimingToSlideData,
      generateSlideDataFromUrls: generateSlideDataFromUrls
    }
  })();
}
