import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-record',
  imports: [CommonModule],
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent {
  isRecording = false;
  mediaRecorder!: MediaRecorder;
  audioChunks: Blob[] = [];
  audioURL: string = '';
  audioBlob!: Blob;
  message = '';

  constructor(private http: HttpClient) {}

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.mediaRecorder.start();
      this.isRecording = true;
      this.audioChunks = [];

      this.mediaRecorder.addEventListener('dataavailable', event => {
        this.audioChunks.push(event.data);
      });

      this.mediaRecorder.addEventListener('stop', () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioURL = URL.createObjectURL(this.audioBlob);
        this.uploadAudio(); // نرفع الصوت مباشرة بعد التسجيل
      });
    });
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.isRecording = false;
  }

uploadAudio() {
  const formData = new FormData();
  formData.append('audio', this.audioBlob, 'recitation.wav');
  formData.append('studentName', 'Sara Test');
  formData.append('verse', 'الفاتحة - الآية 1');
  formData.append('attempt', '1');

  this.http.post('http://localhost:5000/upload', formData).subscribe({
    next: (res: any) => {
      this.message = '✅ تم رفع الصوت وتسجيل البيانات';
      console.log(res);
    },
    error: (err) => {
      this.message = '❌ حدث خطأ أثناء الرفع';
      console.error(err);
    }
  });
}


}
