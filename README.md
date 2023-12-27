# Whisper WebUI

[Robust Speech Recognition via Large-Scale Weak Supervision, PMLR 2023](https://arxiv.org/abs/2212.04356), by Alec Radford, Jong Wook Kim, Tao Xu, Greg Brockman, Christine Mcleavey, Ilya Sutskever  
[Original Github](https://github.com/openai/whisper)

## Dependencies

- Python=3.9
- [Docker](https://www.docker.com/get-started/)

## How to Start

### 1. Ready to use nvidia in docker

```bash
sudo apt-get update 
distribution=$(. /etc/os-release;echo $ID$VERSION_ID) \
   && curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add - \
   && curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
sudo apt-get update 
sudo apt-get install -y nvidia-docker2  
```

### 2. Build and run with Docker

```bash
cd whisper-webui
docker-compose up -d # build docker
```

Now you can access to localhost