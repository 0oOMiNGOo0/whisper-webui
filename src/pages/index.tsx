import {
  JSXElementConstructor,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useRef,
  useState,
  Fragment,
  ChangeEvent,
} from 'react';
import { styled } from 'styled-components';
import React from 'react';

import { AudioRecorder } from 'react-audio-voice-recorder';

const models = [
  { name: 'tiny' },
  { name: 'base' },
  { name: 'small' },
  { name: 'medium' },
  { name: 'large' },
  { name: 'large-v2' },
];

const vads = [
  { name: 'none' },
  { name: 'silero-vad' },
  { name: 'silero-vad-skip-gaps' },
  { name: 'silero-vad-expand-into-gaps' },
  { name: 'periodic-vad' },
];

interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'zh', name: 'Chinese' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'ru', name: 'Russian' },
  { code: 'ko', name: 'Korean' },
  { code: 'fr', name: 'French' },
  { code: 'ja', name: 'Japanese' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'tr', name: 'Turkish' },
  { code: 'pl', name: 'Polish' },
  { code: 'ca', name: 'Catalan' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ar', name: 'Arabic' },
  { code: 'sv', name: 'Swedish' },
  { code: 'it', name: 'Italian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'hi', name: 'Hindi' },
  { code: 'fi', name: 'Finnish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'he', name: 'Hebrew' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'el', name: 'Greek' },
  { code: 'ms', name: 'Malay' },
  { code: 'cs', name: 'Czech' },
  { code: 'ro', name: 'Romanian' },
  { code: 'da', name: 'Danish' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ta', name: 'Tamil' },
  { code: 'no', name: 'Norwegian' },
  { code: 'th', name: 'Thai' },
  { code: 'ur', name: 'Urdu' },
  { code: 'hr', name: 'Croatian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'la', name: 'Latin' },
  { code: 'mi', name: 'Maori' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'cy', name: 'Welsh' },
  { code: 'sk', name: 'Slovak' },
  { code: 'te', name: 'Telugu' },
  { code: 'fa', name: 'Persian' },
  { code: 'lv', name: 'Latvian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'sr', name: 'Serbian' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'kn', name: 'Kannada' },
  { code: 'et', name: 'Estonian' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'br', name: 'Breton' },
  { code: 'eu', name: 'Basque' },
  { code: 'is', name: 'Icelandic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'ne', name: 'Nepali' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'sq', name: 'Albanian' },
  { code: 'sw', name: 'Swahili' },
  { code: 'gl', name: 'Galician' },
  { code: 'mr', name: 'Marathi' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'si', name: 'Sinhala' },
  { code: 'km', name: 'Khmer' },
  { code: 'sn', name: 'Shona' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'so', name: 'Somali' },
  { code: 'af', name: 'Afrikaans' },
  { code: 'oc', name: 'Occitan' },
  { code: 'ka', name: 'Georgian' },
  { code: 'be', name: 'Belarusian' },
  { code: 'tg', name: 'Tajik' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'am', name: 'Amharic' },
  { code: 'yi', name: 'Yiddish' },
  { code: 'lo', name: 'Lao' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'fo', name: 'Faroese' },
  { code: 'ht', name: 'Haitian creole' },
  { code: 'ps', name: 'Pashto' },
  { code: 'tk', name: 'Turkmen' },
  { code: 'nn', name: 'Nynorsk' },
  { code: 'mt', name: 'Maltese' },
  { code: 'sa', name: 'Sanskrit' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'my', name: 'Myanmar' },
  { code: 'bo', name: 'Tibetan' },
  { code: 'tl', name: 'Tagalog' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'as', name: 'Assamese' },
  { code: 'tt', name: 'Tatar' },
  { code: 'haw', name: 'Hawaiian' },
  { code: 'ln', name: 'Lingala' },
  { code: 'ha', name: 'Hausa' },
  { code: 'ba', name: 'Bashkir' },
  { code: 'jw', name: 'Javanese' },
  { code: 'su', name: 'Sundanese' },
];

export default function Home(this: any) {
  const [filteredLanguages, setFilteredLanguages] = useState(languages);
  const [filteredVads, setFilteredVads] = useState(vads);
  const [isListVisible, setListVisibility] = useState(false);
  const [isListVisibleV, setListVisibilityV] = useState(false);
  const inputRef = useRef(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [checked, setChecked] = useState(false);

  const checkClick = (e: { target: { checked: boolean } }) => {
    console.log(e.target.checked);
    if (e.target.checked === false) {
      setChecked(false);
    } else if (e.target.checked === true) {
      setChecked(true);
    }
  };

  const handleButtonClick = (e: any) => {
    if (fileInput.current != null) {
      fileInput.current.click();
    }
  };

  const handleChange = (e: any) => {
    console.log(e.target.files[0]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current) {
        setListVisibility(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onSelectionFocusHandler = () => {
    setListVisibility(!isListVisible);
  };

  const onSelectionSearchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setFilteredLanguages(
      languages.filter((languages) => languages.name.includes(value))
    );
  };

  const onSelectionFocusHandlerV = () => {
    setListVisibilityV(!isListVisibleV);
  };

  const onSelectionSearchHandlerV = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setFilteredVads(vads.filter((vad) => vad.name.includes(value)));
  };

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };
  return (
    <>
      <Description>
        <Text>Whisper is a general-purpose speech recognition model.</Text>
        <Text>
          It is trained on a large dataset of diverse audio and is also a
          multi-task model that can perform multilingual speech recognition as
          well as speech translation and language identification.
        </Text>
        <Text>
          For longer audio files (&#62;10 minutes) not in English, it is
          recommended that you select Silero VAD (Voice Activity Detector) in
          the VAD option.
        </Text>
      </Description>
      <Block1>
        <Block2>
          <Container>
            <Text>Model</Text>
            <ModelSelector>
              {models.map((model) => {
                return <ModelButton>{model.name}</ModelButton>;
              })}
            </ModelSelector>
          </Container>
          <Container>
            <Text>Language</Text>
            <SelectionWrapper>
              <SelectionInput
                onFocus={onSelectionFocusHandler}
                onBlur={onSelectionFocusHandler}
                onChange={onSelectionSearchHandler}
              />
              {isListVisible && (
                <Listbox>
                  {filteredLanguages.map((language) => (
                    <li key={language.code}>{language.name}</li>
                  ))}
                </Listbox>
              )}
            </SelectionWrapper>
          </Container>
          <Container>
            <Text>Url(Youtube, etc)</Text>
            <UrlInput />
          </Container>
          <Container>
            <Text>Upload</Text>
            <Button onClick={handleButtonClick}>파일 업로드</Button>
            <input
              type='file'
              onClick={handleChange}
              ref={fileInput}
              style={{ display: 'none' }}
            />
          </Container>
          <Container>
            <Text>Microphone Input</Text>
            <AudioRecorder
              onRecordingComplete={addAudioElement}
              audioTrackConstraints={{
                noiseSuppression: true,
                echoCancellation: true,
              }}
              downloadOnSavePress={true}
              downloadFileExtension='webm'
            />{' '}
          </Container>
          <Container>
            <Text>Task</Text>
            <Block3>
              <ToggleBlock htmlFor='toggleSwitch'>
                <input
                  type='checkbox'
                  onClick={(e) => checkClick}
                  id='toggleSwitch'
                  hidden
                />
                <ToggleCircle />
              </ToggleBlock>

              <ToggleTextWrapper>
                <Text>Transcribe</Text>
                <Text>Translate</Text>
              </ToggleTextWrapper>
            </Block3>
          </Container>
          <Container>
            <Text>VAD - Merge Window(s)</Text>
            <SelectionWrapper>
              <SelectionInput
                onFocus={onSelectionFocusHandlerV}
                onBlur={onSelectionFocusHandlerV}
                onChange={onSelectionSearchHandlerV}
              />
              {isListVisibleV && (
                <Listbox>
                  {filteredVads.map((vad) => (
                    <li>{vad.name}</li>
                  ))}
                </Listbox>
              )}
            </SelectionWrapper>
          </Container>
        </Block2>
        <Block2>
          <Container>
            <Text>Download</Text>
          </Container>
          <Container>
            <Text>Transcription</Text>
          </Container>
          <Container>
            <Text>Segments</Text>
          </Container>
        </Block2>
      </Block1>
    </>
  );
}

const Description = styled.div`
  padding: 10px 12px;
  gap: 5px;
  display: flex;
  flex-direction: column;
`;

const Block1 = styled.div`
  display: flex;
  gap: 15px;
  margin: 0px 10px;
`;

const Block2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;

  padding: 5px;
  border-radius: 7px;
  background-color: #e5e5e566;
`;

const Text = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: gray;
`;

const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  border-radius: 4px;
  border-color: #8080802e;
  border-width: 1px;
  border-style: solid;
  padding: 12px;
`;

const ModelSelector = styled.div`
  display: flex;
`;

const ModelButton = styled.div`
  font-size: 10px;
  font-weight: 900;
  padding: 10px;
  border-color: #80808076;
  border-width: 1px;
  border-style: solid;

  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }

  &:not(:last-child) {
    border-right: none;
  }
`;

const Listbox = styled.ul`
  width: calc(100% - 12px);
  list-style-type: none;
  font-size: 13px;
  color: gray;
  font-weight: 300;
  padding: 5px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ededed;
  border-radius: 4px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  position: absolute;
  background: white;
  z-index: 1;
  top: 15px;

  & > li {
    padding: 4px;
    cursor: pointer;
  }

  &:empty {
    display: none;
  }
`;

const Button = styled.div`
  border: 1px solid #ccc;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
  color: gray;
  font-weight: 400;
  background-color: white;
`;

const SelectionInput = styled.input`
  width: -webkit-fill-available;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  font-size: 13px;
  color: gray;
  font-weight: 300;
  padding: 6px 8px;
  outline: none;
  display: flex;
  margin: 0;
`;

const SelectionWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const ToggleBlock = styled.label`
  width: 40px;
  display: flex;
  border-radius: 30px;
  padding: 4px;
  position: relative;
  background-color: #d9d9d9;
  transition: background-color 350ms ease;
  cursor: pointer;

  &:has(input:checked) {
    background-color: #5f5f96;
  }
`;

const ToggleCircle = styled.div`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: margin-left 350ms ease;
  margin-left: 0;

  input:checked + & {
    margin-left: 20px;
  }
`;

const UrlInput = styled.input`
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  font-size: 13px;
  color: gray;
  font-weight: 300;
  padding: 6px 8px;
  outline: none;
  display: flex;
  margin: 0;
`;

const Block3 = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;
`;

const ToggleTextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  justify-content: space-between;

  & > div {
    color: #f0f0f0;
    transition: color 350ms ease;
  }

  & > div:first-child {
    color: gray;
  }

  label:has(> input:checked) ~ & > div:first-child {
    color: #f0f0f0;
  }
  label:has(> input:checked) ~ & > div:last-child {
    color: gray;
  }
`;
