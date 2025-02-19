import React, {useState, useCallback, useReducer} from 'react';
import logo from './logo.svg';
import './App.css';

const PlaceholderAddItem = ({dispatch}: {dispatch: React.ActionDispatch<any>}) => {
  const [title, setTitle] = useState("");

  const onChange = useCallback((e: any) => {
    setTitle(e.target.value)
  }, [])

  const onAddNewItem = useCallback(() => {
    dispatch({
      type: "addItem", 
      payload: {
        title: title
      }
    })
    setTitle("") // race condition? think about?
  }, [dispatch, title])


  return <div>
    <input value={title} onChange={onChange}></input>
    <button onClick={onAddNewItem}>Submit</button> 
  </div>
}

const ToDoItem = ({todo, dispatch}: {todo:ToDo, dispatch: React.ActionDispatch<any>}) => {
  const {title, collapsed, completed, id} = todo;

  const onInputChange = useCallback((e: any) => {
    // come back and debounce
    dispatch({
      type: "updateItem",
      payload: {
        id: id,
        newTitle: e.target.value
      }
    })
  }, [dispatch, id])

  const toggleCompletion = useCallback(() => {
    // come back and debounce
    dispatch({
      type: "toggleCompletion",
      payload: {
        id: id,
      }
    })
  }, [dispatch, id])

  const deleteItem = useCallback(() => {
    dispatch({
      type: "deleteItem",
      payload: {
        id: id
      }
    })
  }, [dispatch, id])


  return <div style={{
    display: "flex",
    "alignItems": "center",
    gap: "0.5rem",
  }}>
    <input type="checkbox" checked={completed} onChange={toggleCompletion} />
    <input id={id} value={title} onChange={onInputChange}></input>
    <button onClick={deleteItem}>X</button>
  </div>
}

type ToDo = {
  id: string, // want to use string irl
  title: string,
  completed: boolean,
  collapsed: boolean,
}

type State = {
  todoItems: ToDo[],
  nextId: string,
}

const initialState: State = {
  todoItems: [{title: "Example Item", completed: false, collapsed: false, id: "0"}],
  nextId: "1",
}

type UpdateItemAction = {
  type: "updateItem",
  payload: {
    id: string,
    newTitle: string,
  }
}

type AddItemAction = {
  type: "addItem",
  payload: {
    title: string,
  }
}

type DeleteItemAction = {
  type: "deleteItem",
  payload: {
    id: string,
  }
}


type ToggleCompletionAction = {
  type: "toggleCompletion",
  payload: {
    id: string,
  }
}


type Action = UpdateItemAction | ToggleCompletionAction | DeleteItemAction | AddItemAction;

const todoReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "updateItem": 
      return {
        ...state,
        // replace with nested helper
        todoItems: state.todoItems.map(item => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              title: action.payload.newTitle
            }
          }
          return item
        })
      }
    case "toggleCompletion":
      return {
        ...state,
        // replace with nested helper
        todoItems: state.todoItems.map(item => {
          if (item.id === action.payload.id) {
            return {
              ...item,
              completed: !item.completed
            }
          }
          return item
        })
      }
    case "deleteItem": 
      return {
        ...state,
        todoItems: state.todoItems.filter(item => item.id !== action.payload.id)
      }
    case "addItem":
      return {
        ...state,
        nextId: (parseInt(state.nextId) + 1).toString(),
        todoItems: [...state.todoItems, {
          id: state.nextId,
          title: action.payload.title,
          completed: false,
          collapsed: false,
        }]
      }
    default:
      return state
  }
}

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState); // update to read from local storage


  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
      alignItems: "start",
    }}>
      {state.todoItems.map(item => <ToDoItem key={item.id} todo={item} dispatch={dispatch} />)}
      <PlaceholderAddItem dispatch={dispatch} />
      Next id is: {state.nextId}
    </div>
  );
}

export default App;
