import React, { useEffect, useState} from 'react'
import ReactDom from 'react-dom'


function createStore(init) {
  let data = init
  const eventTarget = new EventTarget()

  return {
    eventTarget: eventTarget,

    get() {
      return data
    },

    update(newData) {
      data = {
        ...data,
        ...newData
      }

      eventTarget.dispatchEvent(new CustomEvent('stateChanged', {
        detail: data
      }))
    }
  }
}


function Module(props) {
  const [color, setColor] = useState('black')

  useEffect(() => {
    function handleStateChanged(e) {
      setColor(e.detail.color)
    }

    props.store.eventTarget.addEventListener('stateChanged', handleStateChanged)

    return () => {
      props.store.eventTarget.removeEventListener('stateChanged', handleStateChanged)
    }
  }, [])

  function setColorInStore(color) {
    props.store.update({ color: color })
  }

  return (
    <div>
      <h1 style={{ color: props.store.get().color }}>
        Hello from module!
      </h1>
      <button onClick={() => setColorInStore('green')}>Green</button>
      <button onClick={() => setColorInStore('red')}>Red</button>
    </div>
  )
}


function createModule() {
  const store = createStore({
    color: 'black'
  })

  return {
    mount(elem) {
      ReactDom.render(<Module store={store} />, elem)
    },
    
    unmount(elem) {
      ReactDom.unmountComponentAtNode(elem)
    },

    setColor(color) {
      store.update({ color: color })
    }
  }
}


window.createModule = createModule

window.createStore = createStore