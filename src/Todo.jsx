import React from "react" 
import { useState, useRef, useEffect } from "react";


function InputField({ list, setList }) {
  const inputText = useRef(null)

  useEffect(() => {
    inputText.current.addEventListener("keypress", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
      }
    })
  }, [])
  
  function handleAdd() {
    if (inputText.current.value === '') {
      alert("The Value enterd is NULL")
    } else {
      try {
        setList([
          ...list,
          { id: list[list.length - 1].id + 1, text: inputText.current.value, done: false, animateAdd: true }
        ])
      } catch (error) {
        setList([
          { id: 0, text: inputText.current.value, done: false, animateAdd: true }
        ])
      }
    }
    inputText.current.value = ""
  }

  return (
    <form className="add-item-contianer">
      <input type="text" className="form-control" style={{ width: "75vw" }} placeholder='Add Item' ref={inputText} />
      <br />
      <button type="button" className="btn add-btn btn-dark" onClick={handleAdd}>Add</button>
    </form>
  )
}

function ListItem({ item, list, setList, animateAdd }) {
  const [editBool, setEditBool] = useState(false)
  const [save, setSave] = useState(false)
  const [deleteBool, setDeleteBool] = useState(false)
  const [defaultTextValue, setDefaultTextValue] = useState(item.text)
  const itemTag = useRef(0)
  const checkMark = useRef(0)
  
  let checked = item.done
  let editedText = ""

  function animateDeleteItem() {
    itemTag.current.style.animation = "delete-item-anim 500ms 1 ease"
    setDeleteBool(true)
  }

  function deleteItem() {
    setList(list.filter((listItem) => listItem != item))
  }

  return (
    <li
      key={item.id}
      className={checked ? "list-group-item list-group-item-done" : "list-group-item"}
      onAnimationEnd={deleteBool ? deleteItem : null}
      ref={itemTag}
      style={animateAdd ? {animation: "add-item-anim 500ms 1 ease"} : deleteBool ? {transform: "translate(200%)"} : {}}
    >
      <input type="checkbox" style={{cursor: "pointer"}} id={item.id} checked={item.done} onChange={() => {
        setList(
          list.map(listItem => listItem === item ? listItem = {...listItem, done: !checked} : listItem)
        )
      }} />
      {
        editBool ?
          <input type="text"
            className="form-control edit-item"
            style={{ width: "70%" }}
            name={defaultTextValue}
            placeholder='Edit Title'
            defaultValue={defaultTextValue}
            onChange={
              (e) => { editedText = e.target.value }
            } />
          :
          <span className={checked ? "item-text item-text-done" : "item-text"} style={{display: "flex", flexDirection: "row", justifyContent: "start", alignItems: "center"}}>
            <span className={checked ? "strike" : ""}>{(item.text).length < 100 ? item.text : (item.text).slice(0, 20) + "..."}</span>
          </span>
      }
      <span className="update-buttons">
        <button className="btn btn-outline-secondary edit-delete-button del-button" type="button" onClick={animateDeleteItem}>Delete</button>
        <button className="btn btn-outline-secondary edit-delete-button edit-button" type="button" style={{ marginRight: '0.3rem', marginLeft: '0.3rem' }} onClick={() => {
          editedText === '' ? setDefaultTextValue(defaultTextValue) : setDefaultTextValue(editedText)
          setEditBool(!editBool)
          if (editBool) {
            setSave(!save)
          }
          setList(list.map(listItem => listItem === item ? listItem = { ...listItem, text: editedText || defaultTextValue } : listItem))
        }}>
          {editBool ? "Save" : "Edit"}
        </button>
        {
          save ?
          <svg className="checkmark" ref={checkMark} viewBox="0 0 52 52">
            <circle className="checkmark__circle" onAnimationEnd={() => { setTimeout(() => { setSave(false) }, 900) }}  cx="26" cy="26" r="25" fill="none" />
            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
          :
          null 
        }
      </span>
    </li>
  )
}

export default function Profile() {
  const [list, setList] = useState(initialTasks)

  return (
    <div className="d-flex flex-column container">
      <h1 className="app-title" >TODO LIST</h1>
      <hr className="line" />
      <InputField list={list} setList={setList}></InputField>
      <br />
      <ul className="list-group">
        {list.map((item) => {
          return <ListItem key={item.id} animateAdd={item.animateAdd} item={item} list={list} setList={setList}></ListItem>
        })}
      </ul>
    </div>
 )
}

const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: false, animateAdd: false},
  {id: 1, text: 'Watch a puppet show', done: false, animateAdd: false},
  {id: 2, text: "Lennon Wall pic", done: false, animateAdd: false},
];