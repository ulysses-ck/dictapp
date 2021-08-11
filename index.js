// div result
const resultDOM = document.getElementById("result")
// btn search
const btnSearch = document.getElementById("btnSearch")

const getValues = () => {
    const inputWord = document.getElementById("inputWord")
    const inputLanguageCode = document.getElementById("languageCode")
    const optDefault = document.getElementById("optDefault")

    console.log(`this is the code lang: "${inputLanguageCode}" .`)
    if (inputWord.value != "" && inputLanguageCode.value != "") {
        getDefinition(inputWord.value, inputLanguageCode.value)
    } else {
        inputWord.setAttribute("placeholder", "Write something :)")
        optDefault.innerHTML = "Select a language, please and try it again"
    }
}

const showResults = (res) => {
    // show results
    resultDOM.removeAttribute("hidden")

    // ensure that has one definition

    const word = document.createElement("div")
    word.innerText = res.data[0].word
    resultDOM.appendChild(word)

    if (res.data[0].phonetic != undefined) {
        const spanPhonetics = document.createElement("span")
        spanPhonetics.innerHTML = res.data[0].phonetic
        resultDOM.appendChild(spanPhonetics)
    }


    for (let i = 0; i < res.data[0].meanings.length; i++) {
        const divCard = document.createElement("div")
        const strongDef = document.createElement("strong")
        const spanExample = document.createElement("span")
        const italic = document.createElement("i")


        // add classes
        divCard.classList.add("card", "my-4", "py-4", "px-4")
        word.classList.add("header")

        // add content
        strongDef.innerHTML = `${i+1}. ${res.data[0].meanings[i].definitions[0].definition}`
        italic.innerHTML = res.data[0].meanings[i].partOfSpeech
        spanExample.innerHTML = `"${res.data[0].meanings[i].definitions[0].example}"`


        // append element
        divCard.appendChild(italic)
        divCard.appendChild(strongDef)
        divCard.appendChild(spanExample)
        resultDOM.appendChild(divCard)

        console.log(res.data[0].meanings[i].definitions[0].definition)

    }
    newSearch()
}

const newSearch = () => {
    btnSearch.innerHTML = "New Search"
    // resultDOM.setAttribute("hidden", "hidden")
}

const getDefinition = (word, language = "en_US") => {
    const urlBase = 'https://api.dictionaryapi.dev/api/v2/entries'

    axios.get(`${urlBase}/${language}/${word}`)
        .then(function (res) {
            console.log(res)
            showResults(res)
        })
        .catch(function (error) {
            console.log(error)
            if (error) {
                // show result
                resultDOM.removeAttribute("hidden")

                // config alert error
                const alertError = document.createElement("div")
                alertError.innerHTML = `The word "${word}" you are looking for could not be found. Make sure to wrote the word correctly`
                alertError.classList.add("alert", "alert-danger")
                resultDOM.appendChild(alertError)
            }
            newSearch()
        })
        .then(function () {
            console.log(".")
            // newSearch()
        });
}