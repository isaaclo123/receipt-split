import {
  RecieptData,
  RecieptAction,
  RecieptType,
} from '../types/index'

const initialState: RecieptType = {
  id: -1,
  name: "Reciept",
  amount: 0,
  date: "2019-12-13",
  resolved: null,
  user_id: -1,
  balances: [],
  reciept_items: [],
}

export default (state:RecieptType = initialState, {
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
  }, {
    name: "onions",
    amount: 8.60,
  }
  ]

  switch (type) {
    case 'GET_RECIEPT_FROM_ID':
      console.log("GET_RECIEPT_FROM_ID")
      return {
        name: `rciept with special ${id}`,
        amount: 100,
        date: "2019-03-20",
        // users: ["me"],
        reciept_items: items
      }
    default:
      return state;
  }
}
