import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

// Função para retornar itens do localStorage se houverem
const getLocalStorage = () => {
  let list = localStorage.getItem('list')
  if (list) {
    return JSON.parse(localStorage.getItem('list'))
  } else {
    return []
  }
}

function App() {
  const [name, setName] = useState('')
  const [list, setList] = useState(getLocalStorage())
  const [isEditing, setIsEditing] = useState(false)
  const [editID, setEditID] = useState(null)
  const [alert, setAlert] = useState({
    show: false,
    msg: '',
    type: '',
  })

  // Retorna itens do localStorage
  useEffect(() => {
    localStorage.setItem('item', JSON.stringify(list))
  }, [list])

  // handleSubmit
  const handleSubmit = (e) => {
    e.preventDefault()

    // Verifica se input está vazio
    if (!name) {
      showAlert(true, 'danger', 'please enter value')
    } else if (name && isEditing) {
      // Edita item
      setList(
        list.map((item) => {
          if (item.id === editID) {
            return { ...item, title: name }
          }
          return item
        })
      )

      setName('')
      setEditID(null)
      setIsEditing(false)
      showAlert(true, 'success', 'value changed')
    } else {
      // Adiciona novo item
      const newItem = { id: new Date().getTime().toString(), title: name }
      setList([...list, newItem])
      setName('')

      showAlert(true, 'success', 'item added to the list')
    }
  }

  // Função que seta valores default de Alerta
  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg })
  }

  // Função para excluir todos os itens
  const clearList = () => {
    setList([])
    showAlert(true, 'danger', 'empty list')
  }

  // Função para excluir apenas o item selecionado
  const removeItem = (id) => {
    setList(list.filter((item) => item.id !== id))
    showAlert(true, 'danger', 'item removed')
  }

  // Função para editar item selecionado
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id)
    setIsEditing(true)
    setEditID(id)
    setName(specificItem.title)
  }

  return (
    <section className='section-center'>
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>grocery bud</h3>
        <div className='form-control'>
          <input
            type='text'
            className='grocery'
            placeholder='e.g. eggs'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type='submit' className='submit-btn'>
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className='grocery-container'>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className='clear-btn' onClick={clearList}>
            clear items
          </button>
        </div>
      )}
    </section>
  )
}

export default App
