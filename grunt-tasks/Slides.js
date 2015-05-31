module.exports = function (grunt) {

  grunt.task.registerTask( 'genLongMethods', 'Generate file list', function() {
    var dataset = Slides.generateSlideDataFromImages('images');
    var setWithTiming = Slides.addTimingToSlideData(dataset);
    Slides.generateSlides("templates/template.html", "long_method.html", setWithTiming);
  });

  grunt.task.registerTask( 'genSparrows', 'Generate file list', function() {
    var dataset = Slides.generateSlideDataFromUrls('sparrows.json');
    var setWithTiming = Slides.addTimingToSlideData(dataset);
    Slides.generateSlides("templates/template.html", "sparrows.html", setWithTiming);
  });

  var Slides = (function() {

    var generateSlideDataFromImages = function(rootDirectory) {
      var slideset = new Array();

      grunt.file.recurse(rootDirectory, function callback(abspath, rootdir, subdir, filename) {
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

    var generateSlideDataFromUrls = function(urlsFileName) {
      var dataset = new Array();
      var types = new Array();
      file = grunt.file.readJSON(urlsFileName);
      for (var i = 0; i < file.data.length; i++) {
        //grunt.log.writeln("entry found:" + file.data[i].type + "/" + file.data[i].url);
        if (types.indexOf(file.data[i].type) == -1) { types.push(file.data[i].type) };
        dataset.push({ project: 'Sparrows',
                       type: file.data[i].type,
                       url: file.data[i].url,
                       index: i,
                       filename: "images/" + file.data[i].type + "/image-" + i + ".jpg"
                    });
      }
      createDirectories(types);
      downloadImages(dataset);
    }

    var downloadImages = function(dataset) {
      dataset.forEach(function(entry) {
        grunt.util.spawn({
          cmd: 'wget',
          args: [entry.url, '-O', entry.filename],
          opts: {stdio: 'inherit'},
        }, function done(error, result, code) {
          grunt.log.writeln("error:" + error);
          grunt.log.writeln("result:" + result);
          grunt.log.writeln("code:" + code);
        });
      });
    }

    var createDirectories = function(directories) {
      directories.forEach(function(entry) {
        grunt.file.mkdir("images/" + entry);
      });
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
