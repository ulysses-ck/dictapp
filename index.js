// div result
const resultDOM = document.getElementById("result")
// btn search
const btnSearch = document.getElementById("btnSearch")

const getValues = () => {


    const inputWord = document.getElementById("inputWord")
    const inputLanguageCode = document.getElementById("languageCode")
    const optDefault = document.getElementById("optDefault")

    if (inputWord.value != "" && inputLanguageCode.value != "") {
        getDefinition(inputWord.value, inputLanguageCode.value)
    } else {
        inputWord.setAttribute("placeholder", "Write something :)")
        optDefault.innerHTML = "Select a language, please and try it again"
    }
}

const remove = () => {
    // if there any definition before search again, remove
    if (document.getElementsByClassName("definition").length) {
        for (let i = 0; i <= document.getElementsByClassName("definition").length; i++) {
            console.log(`Borrando ${i} elemento(s)`)
            console.log(document.getElementsByClassName("definition"))
            document.getElementsByClassName("definition")[i].remove()
        }
    }
    if (document.getElementsByClassName("alert").length) {
        for (let i = 0; i < document.getElementsByClassName("alert").length; i++) {
            document.getElementsByClassName("alert")[i].remove()
        }
    }
}

const showResults = (res) => {
    remove()


    const elemDefinition = document.createElement("div")
    elemDefinition.classList.add("definition")


    // show results
    resultDOM.removeAttribute("hidden")

    const word = document.createElement("div");

    word.innerText = res.data[0].word
    word.classList.add("word")
    elemDefinition.appendChild(word)

    if (res.data[0].phonetic != undefined) {
        const spanPhonetics = document.createElement("span")
        spanPhonetics.innerText = `/${res.data[0].phonetic}/`
        elemDefinition.appendChild(spanPhonetics)
    }

    if (res.data[0].phonetics.length > 0) {
        for (let i = 0; i < res.data[0].phonetics.length; i++) {
            if (res.data[0].phonetics[i].audio != undefined) {
                const audioElem = document.createElement("audio");
                const sourceAudio = document.createElement("source");

                audioElem.classList.add("audioControls", "mx-auto", "my-auto")

                audioElem.setAttribute("controls", "controls");
                sourceAudio.setAttribute("src", res.data[0].phonetics[i].audio);

                audioElem.appendChild(sourceAudio)
                elemDefinition.appendChild(audioElem)
            }
        }
    }

    for (let i = 0; i < res.data[0].meanings.length; i++) {
        const divCard = document.createElement("div")

        // part of speech
        if (res.data[0].meanings[i].partOfSpeech != undefined) {
            const italic = document.createElement("i")
            italic.innerHTML = res.data[0].meanings[i].partOfSpeech
            divCard.appendChild(italic)
        }

        // definition
        const strongDef = document.createElement("strong")

        divCard.classList.add("card", "my-4", "py-4", "px-4")
        strongDef.innerHTML = `${i+1}. ${res.data[0].meanings[i].definitions[0].definition}`
        divCard.appendChild(strongDef)

        // example phrase
        if (res.data[0].meanings[i].definitions[0].example != undefined) {

            const spanExample = document.createElement("span")

            spanExample.innerHTML = `"${res.data[0].meanings[i].definitions[0].example}"`
            divCard.appendChild(spanExample)
        }
        elemDefinition.appendChild(divCard)
        resultDOM.appendChild(elemDefinition)
    }
    btnSearch.innerHTML = "New Search"
}

const getDefinition = (word, language = "en_US") => {
    const urlBase = 'https://api.dictionaryapi.dev/api/v2/entries'

    axios.get(`${urlBase}/${language}/${word}`)
        .then(function (res) {
            showResults(res)
        })
        .catch(function (error) {
            remove()
            console.log(error)
            // show result
            resultDOM.removeAttribute("hidden")

            // config alert error
            const alertError = document.createElement("div")
            alertError.innerHTML = `The word "${word}" you are looking for could not be found. Make sure to wrote the word correctly`
            alertError.classList.add("alert", "alert-danger", "definition")
            resultDOM.appendChild(alertError)
        })
        .then(function () {});
}