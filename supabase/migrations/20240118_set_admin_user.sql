-- Primeiro insere o perfil se não existir
INSERT INTO profiles (id, role)
VALUES ('1e3c493b-4cb1-46e5-88c4-8a95a7eecb34', 'admin')
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';
