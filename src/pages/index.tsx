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
  use,
  useMemo,
} from 'react';
import { styled } from 'styled-components';
import React from 'react';
import Axios from 'axios';
import Image from 'next/image';
import { Socket, io } from 'socket.io-client';

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
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
];

export default function Home(this: any) {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [selectedFromLanguage, setSelectedFromLanguage] = useState<Language>(
    languages[1]
  );
  const [selectedToLanguage, setSelectedToLanguage] = useState<Language>(
    languages[1]
  );
  const fileInput = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(null);
  const [socket, setSocket] = useState<Socket>(null);

  const onModelClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    const {
      dataset: { key },
    } = e.currentTarget;
    setSelectedModel(Number(key) ?? null);
  };

  const onLanguageFromClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    const {
      dataset: { key },
    } = e.currentTarget;

    if (key) {
      setSelectedFromLanguage(languages[key] ?? null);
    }
  };

  const onLanguageToClickHandler = (e: MouseEvent<HTMLDivElement>) => {
    const {
      dataset: { key },
    } = e.currentTarget;
    setSelectedToLanguage(languages[key] ?? null);
  };

  const handleButtonClick = (e: any) => {
    if (fileInput.current != null) {
      fileInput.current.click();
    }
  };

  const handleChange = (e: any) => {
    console.log(e.target.files[0]);
  };

  const handleClearClick = (e: any) => {
    setSelectedModel(null);
    setSelectedFromLanguage(languages[1]);
    setSelectedToLanguage(languages[1]);
  };
  const handleSubmitClick = (e: any) => {};

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!(selectedModel + 1)) {
      alert('모델을 선택해주세요.');
      return;
    }

    const body = {
      selectedFromLanguage: selectedFromLanguage.code,
      selectedToLanguage: selectedToLanguage.code,
      selectedModel: models[selectedModel].name,
      uploadFile: audioFile,
    };

    const formData = new FormData();
    formData.append('test', '12');
    Object.keys(body).forEach((key) =>
      formData.append(
        key,
        !!body[key] || String(body[key]) === 'false' ? body[key] : 'None'
      )
    );

    console.log(formData);
    socket.emit('uploaded', formData);

    const { data } = await Axios.post('http://localhost:5050', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      responseType: 'blob',
    });

    // const href = URL.createObjectURL(data);

    // const link = document.createElement('a');
    // link.href = href;
    // link.setAttribute('download', 'file.zip');
    // link.classList.add('download_link');
    // link.textContent = 'files.zip';

    // document.querySelector('#download')?.appendChild(link);

    // console.log('REQUEST BODY DATA IS', body);
    // console.log('RESPONSE DATA IS', data);
  };

  const task = useMemo(() => {
    if (selectedFromLanguage === selectedToLanguage) return 'transcribe';
    if (selectedFromLanguage !== selectedToLanguage) return 'translate';
  }, [selectedToLanguage, selectedFromLanguage]);

  useEffect(() => {
    const socket = io('http://localhost:5050', {
      transports: ['websocket'],
    });
    // log socket connection
    socket.on('connect', () => {
      console.log('CONNECTED');
      setSocket(socket);
    });

    // update chat on new message dispatched
    socket.on('message', (message: any) => {
      setProgress(message);
      console.log(message);
    });

    socket.on('end', () => {
      console.log('EXIT');
      setTimeout(() => {
        setProgress(null);
      }, 1000);
    });

    // socket disconnect on component unmount if exists
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    console.log(fileInput);
  }, [fileInput]);

  return (
    <>
      <Block1>
        <Block2 onSubmit={onSubmitHandler}>
          <Container>
            <Image
              src='/footer_logo.png'
              alt='footer_logo'
              width={500}
              height={50}
              style={{
                objectFit: 'contain',
                filter: 'invert(1)',
              }}
            />
          </Container>
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
              <SelectionWay>
                {languages.map((language, i) => {
                  return (
                    <ModelButton
                      className={`${
                        selectedFromLanguage === languages[i] ? 'active' : ''
                      }`}
                      onClick={onLanguageFromClickHandler}
                      data-key={i}
                    >
                      {language.name}
                    </ModelButton>
                  );
                })}
              </SelectionWay>
              <SelectionWay>
                {languages.map((language, i) => {
                  return (
                    <ModelButton
                      className={`${
                        selectedToLanguage === languages[i] ? 'active' : ''
                      }`}
                      onClick={onLanguageToClickHandler}
                      data-key={i}
                    >
                      {language.name}
                    </ModelButton>
                  );
                })}
              </SelectionWay>
              <TaskWrapper
                className={`${!!task && task}
              `}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '5px',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Text>Transcribe</Text>
                  <Text>Translate</Text>
                </div>
                <Text>From</Text>
                <Text>
                  {!!selectedFromLanguage && selectedFromLanguage.name}
                </Text>
                <Text>To</Text>
                <Text>{!!selectedToLanguage && selectedToLanguage.name}</Text>
              </TaskWrapper>
            </SelectionWrapper>
          </Container>
          <Container>
            <Upload className={`${audioFile ? 'active' : ''}`}>
              <Text>Upload</Text>
              <Button onClick={handleButtonClick}>파일 업로드</Button>
              <input
                type='file'
                onClick={handleChange}
                onChange={(e) => {
                  const element = e.target as HTMLInputElement;
                  setAudioFile(element.files[0]);
                }}
                ref={fileInput}
                style={{ display: 'none' }}
                multiple
              />
            </Upload>
            {audioFile ? (
              <FileList>
                <File>{audioFile.name}</File>
              </FileList>
            ) : (
              ''
            )}
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
        </Block2>
        <Block2>
          <Container>
            <Text>Download</Text>
            <Download id='download'>
              <Text>파일이 생성되는 곳...</Text>
            </Download>
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

const Block1 = styled.div`
  justify-content: center;
  display: flex;
  padding: 300px 12px;
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
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  padding: 13px;
  border: 1px solid #cfcfcf;
  border-radius: 50px;
  transition: background-color 350ms ease, border 350ms ease;

  &.active {
    background-color: #b5b5ec;
    color: #ffffff;
    background-color: #4050b5;
    border: 1px solid #4050b5;
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

const SelectionWrapper = styled.div`
  width: 100%;
  gap: 10px;
  display: flex;
`;

const SelectionWay = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
`;

const TaskWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 20px;

  & > div:not(:first-child) {
    color: gray;
    width: 30px;
    text-align: center;
  }

  &.translate > div {
    :first-child {
      color: #cfcfcf;
    }
    :nth-child(2) {
      color: gray;
    }
  }
  &.transcribe > div {
    :nth-child(2) {
      color: #cfcfcf;
    }
    :first-child {
      color: gray;
    }
  }
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

const Download = styled.div`
  border: 1px dashed #8d98b581;
  border-radius: 4px;
  width: 200px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  & > div:has(+ a) {
    display: none;
  }
`;

const Upload = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  &.active {
    display: none;
  }
`;

const FileList = styled.div`
  display: flex;
  padding: 15px;
  gap: 5px;
  height: 60px;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  overflow-y: auto;
`;

const File = styled.div`
  font-size: 12px;
  font-weight: 600;
`;
