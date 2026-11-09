(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Hero video: the still stays until the film is actually playing. If the browser blocks
  // autoplay (e.g. iOS Low Power Mode) or the viewer prefers reduced motion, a play button
  // appears over the still instead.
  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const video = hero.querySelector('video');
    const play = hero.querySelector('.hero__play');

    const start = () => {
      video.play().catch(() => { play.hidden = false; });
    };

    const onMetadata = () => {
      hero.classList.add('has-source');
      if (video.videoWidth && video.videoHeight) {
        hero.classList.toggle('is-portrait', video.videoHeight > video.videoWidth);
        hero.style.setProperty('--hero-ratio', `${video.videoWidth} / ${video.videoHeight}`);
      }
      if (reduceMotion) play.hidden = false;
      else start();
    };

    if (video.readyState >= 1) onMetadata();
    else video.addEventListener('loadedmetadata', onMetadata, { once: true });

    video.addEventListener('playing', () => {
      hero.classList.add('has-video');
      play.hidden = true;
    });

    play.addEventListener('click', start);
  }

  // Demo film: loads only when it is scrolled into view, and pauses when it leaves.
  const demo = document.querySelector('[data-demo] video');
  if (demo) {
    if (reduceMotion) {
      demo.controls = true;
    } else {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) demo.play().catch(() => { demo.controls = true; });
        else demo.pause();
      }, { threshold: 0.25 }).observe(demo);
    }
  }
})();
