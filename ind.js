const url = 'https://api.openai.com/v1/audio/transcriptions'


window.addEventListener('load', () => {
    outputElement = document.querySelector('#output-centered')

    const fileInput = document.querySelector('#audio-file')
    fileInput.addEventListener('change', () => {
        setTranscribingMessage('Transcribing...')

        const apiKey = ""
        const file = fileInput.files[0]
        const language = document.querySelector('#language').value
        const response_format = document.querySelector('#response_format').value
        const response = transcribe(apiKey, file, language, response_format)
      
        response.then(transcription => {
            const toChatGPT=transcription.text
            fetchSongTitle (toChatGPT)
             console.log(transcription)
                setTranscribedSegments(transcription.segments)


            // Allow multiple uploads without refreshing the page
            fileInput.value = null
        })
    })
}) 


$(window).on('load', function() {
    $("#song-title").css('display', 'none');
  });
const transcribe = (apiKey, file, language, response_format) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('model', 'whisper-1')
    formData.append('response_format', response_format || 'verbose_json')
    if (language) {
        formData.append('language', language)
    }

    return fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization':"Bearer "+ apiKey
        }
    }).then(response => {
        if (response_format === 'json' || response_format === 'verbose_json')
         {
            return response.json()
        } 
        //else {
         //   return response.text()
        //}
    }).catch(error => console.error(error))
}

const setTranscribingMessage = (text) => {
    outputElement.innerHTML = text
}

const setTranscribedPlainText = (text) => {
    // outputElement.innerText creates unnecessary <br> elements
    text = text.replaceAll('&', '&amp;')
    text = text.replaceAll('<', '&lt;')
    text = text.replaceAll('>', '&gt;')
    outputElement.innerHTML = `<h3>${text}</h3>`
}

const setTranscribedSegments = (segments) => {
    outputElement.innerHTML = ''
    for (const segment of segments) {
        const element = document.createElement('div')
        element.classList.add('segment')
        element.innerText = segment.text
        outputElement.appendChild(element)
       
    }
}


const url2="https://api.openai.com/v1/completions"
const api2=""
async function fetchSongTitle(song_lyrics) {
    try {
      const response = await fetch(url2, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + api2
        },
        body: JSON.stringify({
            'model': 'text-davinci-003',
            'prompt': `Identify the name of the song and singer and movie of the specified lyrics
            ###
            lyrics:Hello darkness, my old friend
            I've come to talk with you again
            Because a vision softly creeping
            Left its seeds while I was sleeping
            And the vision that was planted in my brain
            Still remains
            Within the sound of silence
            In restless dreams I walked alone
            Narrow streets of cobblestone
            'Neath the halo of a street lamp
            I turned my collar to the cold and damp
            When my eyes were stabbed by the flash of a neon light
            That split the night
            And touched the sound of silence
            song: The Sound of Silence by Simon and Garfunkel
            movie: N/A
            ###
            lyrics: Maybe he's right
            Maybe there is something the matter with me
            I just don't see how a world that makes such wonderful things could be bad
            Look at this stuff
            Isn't it neat?
            Wouldn't you think my collection's complete?
            Wouldn't you think I'm the girl
            The girl who has everything?
            Look at this trove
            Treasures untold
            How many wonders can one cavern hold?
            Looking around here you'd think
            Sure, she's got everything
            I've got gadgets and gizmos a-plenty
            I've got whozits and whatzits galore
            You want thingamabobs?
            I've got twenty!
            But who cares?
            No big deal
            I want more
            song: Part of Your World by Jodi Benson
            movie: Little Mermaid
            ###
            lyrics: ${song_lyrics}
            song:
            movie:
            `,
        })
      });
  
      const data = await response.json();
      const title = data.choices[0].text.trim();
      console.log(title)
      songTitle=document.getElementById('song-title')
      songTitle.innerText =  title
      $("#song-title").css('display', 'block');
    } catch (error) {
      console.error("Error:", error);
    }
  }

