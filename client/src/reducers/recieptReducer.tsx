import {
  RecieptData,
  RecieptAction,
  RecieptState,
  RecieptItem
} from '../types/index'

import { List } from 'immutable'

const initialState: RecieptState = {
  name: "Reciept",
  owner: "newuser",
  amount: 0,
  users: List(["newuser"]),
  items: List([])
}

export default (state:RecieptState = initialState, {
  payload,
  type
}: RecieptAction) => {
  if (payload == null) {
    return state
  }

  const { id }: RecieptData = payload

  // alert(username)
  // console.log(username)
  // console.log(password)
  console.log(id)


  const items = [{
    name: "potato",
    amount: 5.0,
    users: List([
    "me",
    "you"
    ])
  }, {
    name: "onions",
    amount: 8.60,
    users: List([
    "isaac", "oliver", "jackie"
    ])
  }
  ]

  switch (type) {
    case 'GET_RECIEPT_FROM_ID':
      console.log("GET_RECIEPT_FROM_ID")
      return {
        name: `rciept with special ${id}`,
        owner: "me",
        amount: 100,
        users: List(["me"]),
        items: List(items)
      }
    default:
      return state;
  }
}
