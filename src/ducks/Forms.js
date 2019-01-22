const ADD_FORM = 'ADD_FORM';

const addForm = (args) => {
    console.log("Action called :", args)
    return {
        type: ADD_FORM,
        args: args,
    }
}

const initialState = {
    forms: []
};

const FormReducer = (state = initialState, action) => {
    console.log("FormReducer called : ", state, action)
    switch(action.type) {
        case ADD_FORM:
        {
            const idx = state.forms.findIndex(elem => elem.name === action.args.name);
            const obj = { ...action.args, key: action.args.name};
            const arr = state.forms;
            arr.push(obj);
            if (idx == -1) {
                return {
                    ...state,
                    forms: arr,
                }
            }
        }
    }
    return state;
}

export default FormReducer;
export {
    ADD_FORM,
    addForm,
};