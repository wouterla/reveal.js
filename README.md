# Fluency presentation Web
A build system to create fluency presentations inspired by @isidore's [FluencyPowerpoint](https://github.com/isidore/FluencyPowerPoint) but based on [Reveal.js](https://github.com/hakimel/reveal.js).

## Run
Currently supports two presentations:

### Sparrows
This has a comparison between house, song and chipping sparrows with images gathered from the web. To avoid rights issues, the images are not included. To download all sparrows images, do:

```
grunt downloadSparrows
```

To then build the presentation, do:

```
grunt genSparrows
```

The presentation is generated as 'allsparrows.html', which means that you can view them on [http://localhost:8000/allsparrows.html](http://localhost:8000/allsparrows.html) after running

```
grunt serve
```

### Code Smells: Long Methods
The first, limited, presentation to train code smells sensitivity. This one trains the difference between long methods, and short enough ones. The images for this presentation are included in the repo, so building it is simply:

```
grunt genLongMethods
```

This on is available as [http://localhost:8000/longmethods.html](http://localhost:8000/longmethods.html).

## extend
All code to generate the slides is in [grunt-tasks/Slides.js](grunt-tasks/Slides.js).

## TODO
- The sparrows presentation doesn't support filtering yet to only include two selected types of sparrows.
- There's no checks yet to balance the number of items in different sets (so you get the same amount of house and song sparrows, for instance)
- The positive/negative reinforcement using green/red colours for code smells should still be added.
