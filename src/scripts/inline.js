;(function() {
  if (typeof Promise === 'undefined') {
    hideLoader()
    return
  }

  const timeout = 10 * 1000
  const start = Date.now()

  loadDeferredStyles(timeout)
    .then(() => {
      const now = Date.now()
      const spent = now - start
      return onReady(timeout - spent)
    })
    .then(hideLoader)
    .catch(hideLoader)

  function loadDeferredStyles(timeout) {
    const deferredStylesNode = document.getElementById('deferred-styles')
    const node = document.createElement('div')
    node.innerHTML = deferredStylesNode.textContent
    const links = node.getElementsByTagName('link')

    const promises = []
    for (let i = 0; i < links.length; i++) {
      promises.push(loadLink(links[i]))
    }

    const loadPromise = Promise.all(promises).then(() =>
      deferredStylesNode.parentElement.removeChild(deferredStylesNode)
    )

    const timeoutPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        reject(`Stylesheet loading timed out`)
      }, timeout)
    })

    return Promise.race([loadPromise, timeoutPromise])
  }

  function loadLink(link) {
    return new Promise(resolve => {
      link.onload = resolve
      document.head.appendChild(link)
    })
  }

  function onReady(timeout) {
    const loadPromise = new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve()
      } else {
        window.addEventListener('load', resolve)
      }
    })

    const timeoutPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        clearTimeout(timer)
        reject(`Window loading timed out`)
      }, timeout)
    })

    return Promise.race([loadPromise, timeoutPromise])
  }

  function hideLoader() {
    if (window.$) {
      $('#loader').fadeOut()
    } else {
      document.getElementById('loader').style.display = 'none'
    }
  }
})()
