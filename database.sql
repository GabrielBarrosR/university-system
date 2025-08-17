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
  ativo boolean DEFAULT true,
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
  diaSemana VARCHAR(100),
  horario varchar(10),
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

INSERT INTO turmas (nome, id_curso, id_periodo, id_professor, diaSemana, horario)
VALUES 
  ('Algoritmos e Lógica de Programação', 1, 1, 1, 'Segunda-feira', '08:00'),
  ('Matemática Discreta', 1, 1, 2, 'Terça-feira', '10:00'),
  ('Introdução à Computação', 1, 1, 3, 'Quarta-feira', '08:00'),
  ('Arquitetura de Computadores', 1, 2, 1, 'Quinta-feira', '14:00'),
  ('Estruturas de Dados', 1, 2, 2, 'Sexta-feira', '10:00'),
  ('Banco de Dados I', 1, 3, 3, 'Segunda-feira', '14:00'),
  ('Engenharia de Software', 1, 4, 1, 'Terça-feira', '16:00'),
  ('Redes de Computadores', 1, 4, 2, 'Quarta-feira', '14:00'),
  ('Sistemas Operacionais', 1, 3, 3, 'Quinta-feira', '10:00');
