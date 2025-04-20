<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class AddUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:add-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $nome = $this->ask('Qual o nome do usuário?');
        $email = $this->ask('Qual o e-mail do usuário?');
        $password = $this->ask('Qual a senha do usuário?');

        $user = new User();

        $user->name = $nome;
        $user->email = $email;
        $user->password = Hash::make($password);
        $user->save();
        $this->info('Usuário criado com sucesso!');
    }
}
