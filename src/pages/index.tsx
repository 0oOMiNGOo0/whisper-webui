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
} from 'react';
import { styled } from 'styled-components';

const models = [
  { name: 'tiny' },
  { name: 'base' },
  { name: 'small' },
  { name: 'medium' },
  { name: 'large' },
  { name: 'large-v2' },
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLanguages, setFilteredLanguages] = useState(languages);
  const [isListVisible, setListVisibility] = useState(false);
  const inputRef = useRef(null);
  const fileInput = useRef(null);

  const handleButtonClick = (e: any) => {
    fileInput.current.click();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered: Language[] = languages.filter((language: Language) =>
      language.name.toLowerCase().includes(value)
    );
    setFilteredLanguages(filtered);
    setListVisibility(value.length > 0);
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
            <input
              type='text'
              onChange={handleInputChange}
              value={searchTerm}
              style={{ border: '1 solid #e5e5e566' }}
              onFocus={() => setListVisibility(true)}
            />
            {isListVisible && (
              <Listbox>
                {filteredLanguages.map((language) => (
                  <li key={language.code}>{language.name}</li>
                ))}
              </Listbox>
            )}
          </Container>
          <Container>
            <Text>Url(Youtube, etc)</Text>
            <input />
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
  width: 350px;
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
  list-style-type: none;
  font-size: 13px;
  color: gray;
  font-weight: 300;
  padding: 5px;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 4px;
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
