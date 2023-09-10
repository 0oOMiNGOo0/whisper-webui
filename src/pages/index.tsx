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
  MouseEvent,
  FormEvent,
} from 'react';
import { styled } from 'styled-components';
import React from 'react';
import Axios from 'axios';

import { AudioRecorder } from 'react-audio-voice-recorder';

const models = [
  { name: 'tiny' },
  { name: 'base' },
  { name: 'small' },
  { name: 'medium' },
  { name: 'large' },
  { name: 'large-v2' },
];

interface Vad {
  name: string;
}

const vads: Vad[] = [
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
  const [audioFile, setAudioFile] = useState<File>();
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    languages[0]
  );
  const [selectedVad, setSelectedVad] = useState<Vad>(vads[1]);
  const [filteredLanguages, setFilteredLanguages] = useState(languages);
  const [filteredVads, setFilteredVads] = useState(vads);
  const [isListVisible, setListVisibility] = useState(false);
  const [isListVisibleV, setListVisibilityV] = useState(false);
  const inputRef = useRef(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [checked, setChecked] = useState(false);

  const onModelClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    const {
      dataset: { key },
    } = e.currentTarget;
    setSelectedModel(Number(key) ?? null);
  };

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
    const handleClickOutside = () => {
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
      languages.filter((languages) =>
        languages.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      )
    );
  };

  const onSelectionFocusHandlerV = () => {
    setListVisibilityV(!isListVisibleV);
  };

  const onSelectionSearchHandlerV = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setFilteredVads(
      vads.filter((vad) =>
        vad.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
      )
    );
  };

  const addAudioElement = (blob: Blob) => {
    setAudioFile(new File([blob], 'file'));
  };

  const onLaunguageClickHandler = (e: MouseEvent<HTMLLIElement>) => {
    const {
      dataset: { code },
    } = e.currentTarget;

    console.log(code);
    if (code) {
      (document.getElementById('languageInput') as HTMLInputElement).value =
        languages.find((l) => l.code === code)?.name ?? '';
      setSelectedLanguage(
        languages.find((l) => l.code === code) ?? languages[0]
      );
      onSelectionFocusHandler();
    }
  };

  const onVadClickHandler = (e: MouseEvent<HTMLLIElement>) => {
    const {
      dataset: { name },
    } = e.currentTarget;

    console.log(name);
    if (name) {
      (document.getElementById('vadInput') as HTMLInputElement).value =
        vads.find((l) => l.name === name)?.name ?? '';
      setSelectedVad(vads.find((l) => l.name === name) ?? vads[0]);
      onSelectionFocusHandlerV();
    }
  };

  const handleClearClick = (e: any) => {
    setSelectedModel(null);
  };
  const handleSubmitClick = (e: any) => {};

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedModel) {
      alert('모델을 선택해주세요.');
      return;
    }
    const target = e.target as unknown as HTMLInputElement[];

    const youtube = target[1].value;
    const record = null;

    const arr = [youtube, audioFile, record].filter((x) => !!x);

    if (arr.length === 0) {
      alert('옵션 하나 선택');
      return;
    }

    if (arr.length > 1) {
      alert('2개 이상 ㄴㄴ');
      return;
    }

    const task = target[3].checked;
    const mergeWindows = target[5].value;
    const maxMergeSize = target[6].value;
    const isTimestamps = target[7].checked;
    const isHighlight = target[8].checked;

    console.log(isHighlight);

    const body = {
      selectedLanguage: selectedLanguage.code,
      selectedModel: models[selectedModel].name,
      selectedVad: selectedVad.name,
      youtube,
      uploadFile: audioFile,
      record,
      task,
      mergeWindows,
      maxMergeSize,
      isTimestamps,
      isHighlight,
    };

    const formData = new FormData();
    Object.keys(body).forEach((key) =>
      formData.append(
        key,
        !!body[key] || String(body[key]) === 'false' ? body[key] : 'None'
      )
    );

    const { data } = await Axios.post(
      'http://1bd4-35-232-137-103.ngrok-free.app',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('REQUEST BODY DATA IS', body);
    console.log('RESPONSE DATA IS', data);
  };

  return (
    <>
      <Block1>
        <Block2 onSubmit={onSubmitHandler}>
          <Description>
            <Text>Whisper is a general-purpose speech recognition model.</Text>
            <Text>
              It is trained on a large dataset of diverse audio and is also a
              multi-task model that can perform multilingual speech recognition
              as well as speech translation and language identification.
            </Text>
            <Text>
              For longer audio files (&#62;10 minutes) not in English, it is
              recommended that you select Silero VAD (Voice Activity Detector)
              in the VAD option.
            </Text>
          </Description>
          <Line />
          <Container>
            <Text>Model</Text>
            <ModelSelector>
              {models.map((model, i) => {
                return (
                  <ModelButton
                    className={`${selectedModel === i ? 'active' : ''}`}
                    onClick={onModelClickHandler}
                    data-key={i}
                  >
                    {model.name}
                  </ModelButton>
                );
              })}
            </ModelSelector>
          </Container>
          <Container>
            <Text>Language</Text>
            <SelectionWrapper>
              <SelectionInput
                id='languageInput'
                onFocus={onSelectionFocusHandler}
                onChange={onSelectionSearchHandler}
                placeholder='select the language...'
                defaultValue={selectedLanguage.name}
              />
              {isListVisible && (
                <Listbox>
                  {filteredLanguages.map((language, i) => (
                    <li
                      key={i}
                      data-code={language.code}
                      onClick={onLaunguageClickHandler}
                    >
                      {language.name}
                    </li>
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
              downloadFileExtension='mp3'
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
            <Text>VAD</Text>
            <SelectionWrapper>
              <SelectionInput
                id='vadInput'
                onFocus={onSelectionFocusHandlerV}
                onChange={onSelectionSearchHandlerV}
                placeholder='select the Voice Activy Detector'
                defaultValue={selectedVad.name}
              />
              {isListVisibleV && (
                <Listbox>
                  {filteredVads.map((vad, i) => (
                    <li
                      key={i}
                      data-name={vad.name}
                      onClick={onVadClickHandler}
                    >
                      {vad.name}
                    </li>
                  ))}
                </Listbox>
              )}
            </SelectionWrapper>
          </Container>
          <Container>
            <Text>VAD - Merge Window(s)</Text>
            <UrlInput
              type='number'
              defaultValue={5}
              required
              placeholder='please enter only number'
            />
          </Container>
          <Container>
            <Text>VAD - Max Merge Size(s)</Text>
            <UrlInput
              type='number'
              defaultValue={30}
              required
              placeholder='please enter only number'
            />
          </Container>
          <Container>
            <CheckboxWrapper>
              <Label>
                Word Timestamps
                <input type='checkbox' name='timestamp' />
              </Label>
              <Label>
                Highlight Words
                <input type='checkbox' name='highlight' />
              </Label>
            </CheckboxWrapper>
          </Container>
          <Container>
            <ButtonWrapper>
              <Submit onClick={handleClearClick} type='reset'>
                Clear
              </Submit>
              <Submit onClick={handleSubmitClick} type='submit'>
                Submit
              </Submit>
            </ButtonWrapper>
          </Container>
          <Line />
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
  gap: 5px;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

const Block1 = styled.div`
  margin: auto;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  padding: 15px 12px;
  gap: 15px;
`;

const Block2 = styled.form`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 20px 14px;
  border-radius: 7px;
  border: 1px solid white;
  box-shadow: 0 0 16px 0px #00000017;
`;

const Text = styled.div`
  font-size: 12px;
  color: #3f51b5;
  font-weight: 600;
  padding: 3px 0px;
`;

const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  padding: 10px;
`;

const ModelSelector = styled.div`
  display: flex;
  gap: 10px;
`;

const ModelButton = styled.div`
  font-size: 11px;
  font-weight: 700;
  padding: 13px;
  border: 1px solid #cfcfcf;
  border-radius: 50px;
  transition: background-color 350ms ease;

  &.active {
    background-color: #b5b5ec;
    color: #ffffff;
    background-color: #4050b5;
    border: none;
  }
`;

const Listbox = styled.ul`
  width: calc(100% - 12px);
  list-style-type: none;
  font-size: 13px;
  color: gray;
  font-weight: 400;
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
  border: 1px solid #cfcfcf;
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
  border: 1px solid #cfcfcf;
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
  border: 1px solid #cfcfcf;
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
    color: #cfcfcf;
    transition: color 350ms ease;
  }

  & > div:first-child {
    color: gray;
  }

  label:has(> input:checked) ~ & > div:first-child {
    color: #cfcfcf;
  }
  label:has(> input:checked) ~ & > div:last-child {
    color: gray;
  }
`;

const Line = styled.div`
  border: 1px solid #8d98b581;
  width: calc(100% - 16px);
  height: 0px;
  margin: 20px auto;
  border-style: dashed;
`;

const Submit = styled.button`
  background-color: #6868ac;
  font-weight: 400;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  padding: 10px;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: space-around;
`;

const Label = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #3f51b5;
  font-weight: 600;
  padding: 3px 0px;
  gap: 2px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  gap: 20px;
`;
