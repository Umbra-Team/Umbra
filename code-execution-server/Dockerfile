FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno cache main.ts

CMD ["run", "--allow-all", "main.ts"]