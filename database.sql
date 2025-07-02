CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('aluno', 'professor') NOT NULL,
  status ENUM('ativo', 'inativo') DEFAULT 'ativo',
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cursos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100)
);

CREATE TABLE periodos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL 
);

CREATE TABLE alunos (
  matricula INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(100) NOT NULL,
  logradouro VARCHAR(100),
  numero INT,
  id_periodo INT,
  id_curso INT,
  id_usuario INT,
  CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
  CONSTRAINT fk_curso FOREIGN KEY (id_curso) REFERENCES cursos(id),
  CONSTRAINT fk_periodo_aluno FOREIGN KEY (id_periodo) REFERENCES periodos(id)
);

CREATE TABLE turmas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  id_curso INT NOT NULL,
  id_periodo INT NOT NULL,
  id_professor INT NOT NULL,
  FOREIGN KEY (id_curso) REFERENCES cursos(id),
  FOREIGN KEY (id_professor) REFERENCES usuarios(id),
  CONSTRAINT fk_periodo_turma FOREIGN KEY (id_periodo) REFERENCES periodos(id)
);

CREATE TABLE avaliacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_aluno INT NOT NULL,
  id_turma INT NOT NULL,
  nota DECIMAL(5,2),
  exames varchar(30),
  data_registro DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (id_aluno) REFERENCES alunos(matricula),
  FOREIGN KEY (id_turma) REFERENCES turmas(id)
);

CREATE TABLE faltas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_aluno INT NOT NULL,
  id_turma INT NOT NULL,
  falta INT NOT NULL,
  tipo VARCHAR(30) NOT NULL,
  data_registro DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (id_aluno) REFERENCES alunos(matricula),
  FOREIGN KEY (id_turma) REFERENCES turmas(id)
);

INSERT INTO periodos (nome) VALUES
  ('1º Período'),
  ('2º Período'),
  ('3º Período'),
  ('4º Período'),
  ('5º Período'),
  ('6º Período'),
  ('7º Período'),
  ('8º Período');

  INSERT INTO cursos (nome) VALUES 
  ('Ciência da Computação'),
  ('Tecnologia da Informação'),
  ('Análise e Desenvolvimento de Sistemas');

INSERT INTO usuarios (nome, email, senha, tipo)
VALUES 
  ('Carlos Silva', 'carlos@exemplo.com', '$2a$12$gjz539aZqekjrYyU/3ZqHuxw/LHKfWHStBwLynWpviywbnDIm8Myy', 'professor'),
  ('Mariana Souza', 'mariana@exemplo.com', '$2a$12$gjz539aZqekjrYyU/3ZqHuxw/LHKfWHStBwLynWpviywbnDIm8Myy', 'professor'),
  ('Roberto Lima', 'roberto@exemplo.com', '$2a$12$gjz539aZqekjrYyU/3ZqHuxw/LHKfWHStBwLynWpviywbnDIm8Myy', 'professor');

INSERT INTO turmas (nome, id_curso, id_periodo, id_professor)
VALUES 
  ('Algoritmos e Lógica de Programação', 1, 1, "id_professor"),
  ('Matemática Discreta', 1, 1, "id_professor"),
  ('Introdução à Computação', 1, 1, "id_professor"),
  ('Arquitetura de Computadores', 1, 2, "id_professor"),
  ('Estruturas de Dados', 1, 2, "id_professor"),
  ('Banco de Dados I', 1, 3, "id_professor"),
  ('Engenharia de Software', 1, 4, "id_professor"),
  ('Redes de Computadores', 1, 4, "id_professor"),
  ('Sistemas Operacionais', 1, 3, "id_professor");
