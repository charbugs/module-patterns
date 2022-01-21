import React, { createContext, useContext, useEffect, useState} from 'react'
import ReactDom from 'react-dom'


// init: object
function createStore(init) {
  let state = init
  const eventTarget = new EventTarget()

  return {
    eventTarget: eventTarget,

    get() {
      return state
    },

    // newState: object
    // state = { color: 'blue', text: 'hello' }
    // set({ color: 'red' })
    // -> { color: 'red', text: 'hello' }
    set(newState) {
      state = {
        ...state,
        ...newState
      }

      eventTarget.dispatchEvent(new CustomEvent('stateChanged', {
        detail: state
      }))
    }
  }
} 

const StoreContext = createContext()

function StoreProvider(props) {
  const [_store, setStore] = useState(props.store)

  useEffect(() => {
    function rerender(e) {
      setStore({ ...props.store })
    }

    props.store.eventTarget.addEventListener('stateChanged', rerender)

    return () => {
      props.store.eventTarget.removeEventListener('stateChanged', rerender)
    }
  }, [])

  return (
    <StoreContext.Provider value={_store}>
      { props.children}
    </StoreContext.Provider>
  ) 
}


function Module(props) {
  const store = useContext(StoreContext)

  return (
    <div>
      <h1 style={{ color: store.get().color }}>
        Hello from module!
      </h1>
      <SetColor />
      <SayColor />
    </div>
  )
}

function SetColor() {
  const store = useContext(StoreContext)
  return (
    <>
      <button onClick={() => store.set({ color: 'green'})}>Green</button>
      <button onClick={() => store.set({ color: 'red' })}>Red</button>
    </>
  )
}

function SayColor() {
  const store = useContext(StoreContext)
  return <h3>{store.get().color}</h3>
}

function createModule() {

  const store = createStore({
    color: 'hotpink'
  })

  function mount(elem) {
    ReactDom.render(
      <StoreProvider store={store}>
        <Module store={store} />
      </StoreProvider>,
      elem
    )
  }
  
  function unmount(elem) {
    ReactDom.unmountComponentAtNode(elem)
  }

  function setColor(color) {
    store.set({ color: color })
  }

  return { mount, unmount, setColor }
}


window.createModule = createModule
window.createStore = createStore